import AutoEmbedPlugin from "src/main";
import { PreloadOptions, SupportedWebsites } from "src/settings-tab";
import { Dictionary, Size } from "src/utility";

export class BaseEmbedData {
    embedSource: EmbedBase;
    // TODO: Add url
    originalString?: string;
    shouldEmbed: boolean;
    alt?: string;
    width?: string;
    height?: string;
    
    embedIframeEl: HTMLIFrameElement;
    embedContainer: HTMLDivElement;

    constructor(embedSource: EmbedBase, originalString: string) {
        this.embedSource = embedSource;
        this.originalString = originalString;
        this.shouldEmbed = true;
    }
}

export interface EmbedResult {
    embedData: BaseEmbedData;

    containerEl: HTMLDivElement;
    embed: HTMLElement;
    iframeEl?: HTMLIFrameElement;
    placeholderEl?: HTMLDivElement;
}

export abstract class EmbedBase {
    readonly autoEmbedCssClass: string = "auto-embed";
    readonly name: SupportedWebsites | "Other" | "Fallback";
    // To identify if the anchor link matches the embed type
    readonly regex: RegExp; 
    // Embed websites usually post a resize message.
    // This is to identify which website sent the message. 
    // If the website doesn't need / doesn't send the message, it'll be undefined.
    readonly embedOrigin?: string;
    readonly plugin: AutoEmbedPlugin;
    // Cache the height of the embed. 
    // Correctly sizes the embeds that it has seen before as soon as the embed is loaded. Reducing Cumulative Layout Shift.
    // Helps also when some websites don't send the resize message for some reason.
    sizeCache: Dictionary<Size>; 
    
    constructor(plugin: AutoEmbedPlugin) {
        this.plugin = plugin;
        this.sizeCache = {};
    }
    
    abstract createEmbed(link: string, embedData?: BaseEmbedData): HTMLElement;

    create(link: string, embedData: BaseEmbedData): EmbedResult {
        const container = createDiv({cls: "auto-embed-container"})
        
        const embed = this.createEmbed(link, embedData);
        const iframe = embed instanceof HTMLIFrameElement ? embed : embed.querySelector(':scope > iframe') as HTMLIFrameElement;

        // if (embedData?.embedSource.name === "Fallback") 
        //     return { embedData: embedData, containerEl: embed as HTMLDivElement };

        // Add embed
        container.appendChild(embed);

        // Copy any class and styles
        embed.classList.forEach(c => container.classList.add(c));
        container.style.cssText = embed.style.cssText;

        // Add placeholder
        let placeholder: HTMLDivElement | undefined;
        const hideClass = "auto-embed-hide";

        // Called twice at different times. So put it out in a function
        function AddOnLoadEvent(iframe: HTMLIFrameElement) {
            iframe?.addEventListener("load", () => {
                // Hide placeholder, Show embed
                embed.classList.remove(hideClass);
                placeholder?.classList.add(hideClass);
            });
        }

        if (this.plugin.settings.preloadOption !== PreloadOptions.None)
        {
            placeholder = this.generatePlaceholder(link);
            container.appendChild(placeholder);
            
            embed.classList.add(hideClass);

            if (this.plugin.settings.preloadOption === PreloadOptions.Placeholder_ClickToLoad) {
                // Prevent the iframe from loading. Store the url in the dataset
                iframe.dataset.src = iframe.src;
                iframe.src = "about:blank"; 

                placeholder.addEventListener("click", () => {
                    placeholder?.classList.toggle("auto-embed-click-to-load", false);

                    // Show loader
                    const loader = placeholder?.querySelector(".auto-embed-loader");
                    if (loader) 
                        loader.classList.toggle("auto-embed-hide", false);

                    const status = placeholder?.querySelector(".auto-embed-placeholder-status");
                    if (status) 
                        status.textContent = "Loading embed...";
                    
                    if (!iframe.dataset.src)
                    {
                        console.error("iframe.dataset.src is not set");
                        return;
                    }

                    iframe.src = iframe.dataset.src;
                    AddOnLoadEvent(iframe);
                })
            }
            else {
                AddOnLoadEvent(iframe);
            }
        }

        return {
            embedData: embedData,
            containerEl: container,
            embed: embed,
            iframeEl: iframe ?? undefined,
            placeholderEl: placeholder
        }
    }

    getOptions(alt: string): BaseEmbedData {
        const options: BaseEmbedData = new BaseEmbedData(this, alt);

        if (!alt)
            return options;

        // Don't need to check the rest since not embedding.
        if (alt.match(/noembed/)) {
            options.shouldEmbed = false;
            return options;
        }
        else {
            options.shouldEmbed = true;
        }

        options.alt = alt;

        // TODO Options: 
        // - Size: Set both height and width at the same time. [size:100x200]

        // TODO: Optimise this? If there are alot of options, it might be slow.
        const widthMatch = alt.match(/(?:w|width)\s*(?::|=)\s*(\d+(?:%|\w+))/);
        if (widthMatch) {
            options.width = widthMatch[1];
            options.alt = options.alt.replace(widthMatch[0], "");
        }

        const heightMatch = alt.match(/(?:h|height)\s*(?::|=)\s*(\d+(?:%|\w+))/);
        if (heightMatch) {
            options.height = heightMatch[1];
            options.alt = options.alt.replace(heightMatch[0], "");
        }

        return options;
    }

    applyModifications(embedResult: EmbedResult, data: BaseEmbedData) {
        // Applying attributes. Do here to avoid repeating this code
        // console.log("Tagname: " + el.tagName)
        if (embedResult.iframeEl) {
            if (this.plugin.settings.preloadOption !== PreloadOptions.Placeholder_ClickToLoad)
                embedResult.iframeEl.setAttribute("loading", "lazy");
            
            embedResult.iframeEl.setAttribute("allowfullscreen", "true");
            embedResult.iframeEl.setAttribute("allowtransparency", "true");
        }

        // Applying options
        if (data.width)
            embedResult.containerEl.style.width = data.width;
        
        if (data.height)
            embedResult.containerEl.style.height = data.height;
    }

    // For when the iframe is still loading
    generatePlaceholder(link: string) : HTMLDivElement {
        const isClickToLoad = this.plugin.settings.preloadOption === PreloadOptions.Placeholder_ClickToLoad;
        const container = createDiv(
            {
                cls: `auto-embed-placeholder ${isClickToLoad ? "auto-embed-click-to-load":""}`, 
                title: link
            });
        
        createSpan( 
            {
                parent: container, 
                text: isClickToLoad ? "Click to load embed" : "Loading embed...", 
                cls: "auto-embed-placeholder-status"
            });

        createSpan({cls: "auto-embed-loader auto-embed-hide", parent: container});
        
        createEl("p", 
            {
                parent: container, 
                text: `Link: ${link}`, 
                cls: "auto-embed-placeholder-link"
            });

        return container;
    }

    // afterInsertingToDOM?(embed: HTMLElement): void;
    
    // To have a embed source respond to the resize event:
    // - Set EmbedBase.embedOrigin (e.g. embedOrigin = "https://platform.twitter.com")
    // - Implement body of resize method here (onResizeMessage)
    // - Remember to resize the container too! Call this.resizeContainer()
    onResizeMessage?(e: MessageEvent): void;

    resizeContainer(el: HTMLElement, height?: string, width?: string) {
        // Quick way to resize container. A better way might be to pass EmbedResult
        if (height && el.parentElement)
            el.parentElement.style.height = height;
        
        if (width && el.parentElement)
                el.parentElement.style.width = width;
    }

    onErrorCreatingEmbed(msg?: string): HTMLElement {
        const errorMsg = msg ?? `Error with ${this.name} url`;
        const error = createEl("p", {cls: `${this.autoEmbedCssClass} error-embed`});
        error.setText(errorMsg);

        console.log("auto-embed/error: " + errorMsg);
        return error;
    }
}