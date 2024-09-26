import { FallbackOptions, SupportedWebsites } from "src/settings-tab";
import { BaseEmbedData, EmbedBase } from "./embedBase";
import { requestUrl } from "obsidian";

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

                if (embedOptions.alt || (this.plugin.settings.fallbackDefaultLink && !this.plugin.settings.fallbackAutoTitle)) {
                    const linkText = embedOptions.alt ? embedOptions.alt : this.plugin.settings.fallbackDefaultLink;
                    const link = createEl("a", {href: url, text: linkText.trim()});
                    embedContainer.appendChild(link);
                }
                else if (this.plugin.settings.fallbackAutoTitle) {
                    // Scrape the title and add it.
                    const link = createEl("a", {href: url, text: "Loading title..."});
                    this.linkTitle(url).then(title => link.text = title);
                    embedContainer.appendChild(link);
                }

                return embedContainer;
            }
            case FallbackOptions.Hide:
                return createEl("span", {cls: "auto-embed-hide-visibility"});
        }
    }

    async linkTitle(url: string) {
        try {
            const response = await requestUrl({url: url, method: "GET"});
            
            console.log(response);

            if (!response.headers["content-type"].includes("text/html"))
                return this.plugin.settings.fallbackDefaultLink;

            const html = response.text;
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const title = doc.querySelector('title');

            if (title && title.text) {
                return title.text;
            }
            else {
                return this.plugin.settings.fallbackDefaultLink;
            }
        } catch (ex) {
            return `Error: ${ex.message}`;
        }
    }
} 