import { FallbackOptions, SupportedWebsites } from "src/settings-tab";
import { BaseEmbedData, EmbedBase } from "./embedBase";

export class DefaultFallbackEmbed extends EmbedBase {
    name: SupportedWebsites | "Fallback" = "Fallback";
    regex = new RegExp(/ /); // Not using regex for this

    createEmbed(url: string, embedOptions: BaseEmbedData): HTMLElement {
        // const youtubeMatch = url.match(/https:\/\/www.youtube.com\/embed\/(\w+)/);
        // console.log("Match : " + youtubeMatch)
        // if (youtubeMatch)
        //     return this.onErrorCreatingEmbed(`Unable to parse YouTube ${youtubeMatch[1]} urls. Try deleting "/${youtubeMatch[1]}"`);

        switch (this.plugin.settings.fallbackOptions) {
            case FallbackOptions.ShowErrorMessage:
                return this.onErrorCreatingEmbed(url, "Website is not supported");
            case FallbackOptions.EmbedLink:
            { 
                const embedContainer = createSpan();
                embedContainer.addClass(this.autoEmbedCssClass, "default-fallback-embed-container");

                // Creating the iframe
                const iframe = createEl("iframe");
                
                iframe.src = url;
                
                iframe.classList.add(this.autoEmbedCssClass);
                iframe.dataset.containerClass = "default-fallback-embed";
                
                if (embedOptions.width)
                    embedContainer.style.width = embedOptions.width;
                else {
                    const width = this.plugin.settings.fallbackWidth;
                    if (width) 
                        embedContainer.style.width = width;
                }
                
                if (embedOptions.height)
                    embedContainer.style.height = embedOptions.height;
                else {
                    const height = this.plugin.settings.fallbackHeight;
                    if (height) 
                        embedContainer.style.height = height;
                }

                embedContainer.appendChild(iframe);

                if (this.plugin.settings.fallbackDefaultLink || embedOptions.alt) {
                    const linkText = embedOptions.alt ? embedOptions.alt : this.plugin.settings.fallbackDefaultLink;
                    const link = createEl("a", {href: iframe.src, text: linkText.trim()});
                    embedContainer.appendChild(link);
                }

                return embedContainer;
            }
            case FallbackOptions.Hide:
                return createEl("span", {cls: "auto-embed-hide-visibility"});
        }
    }
} 