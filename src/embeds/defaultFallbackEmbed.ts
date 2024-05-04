import { FallbackOptions } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class DefaultFallbackEmbed extends EmbedBase {
    name = "Fallback Embed";
    regex = new RegExp(/ /); // Not using regex for this

    createEmbed(url: string): HTMLElement {
        // const youtubeMatch = url.match(/https:\/\/www.youtube.com\/embed\/(\w+)/);
        // console.log("Match : " + youtubeMatch)
        // if (youtubeMatch)
        //     return this.onErrorCreatingEmbed(`Unable to parse YouTube ${youtubeMatch[1]} urls. Try deleting "/${youtubeMatch[1]}"`);

        switch (this.plugin.settings.fallbackOptions) {
            case FallbackOptions.ShowErrorMessage:
                return this.onErrorCreatingEmbed("Unable to embed: " + url);
            case FallbackOptions.EmbedLink:
            {        
                // Creating the iframe
                const iframe = createEl("iframe");
                
                iframe.src = url;
                
                iframe.classList.add(this.autoEmbedCssClass, "default-fallback-embed");

                const width = this.plugin.settings.fallbackWidth;
                if (width) {
                    iframe.style.width = width;
                }
                
                const height = this.plugin.settings.fallbackHeight;
                if (height) {
                    iframe.style.height = height;
                }

                return iframe;
            }
            case FallbackOptions.Hide:
                return createEl("span", {cls: "auto-embed-hide"});
        }
    }
} 