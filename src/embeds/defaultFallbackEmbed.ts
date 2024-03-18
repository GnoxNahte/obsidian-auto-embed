import { FallbackOptions } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class DefaultFallbackEmbed extends EmbedBase {
    name = "Fallback Embed";
    regex = new RegExp(/ /); // Not using regex for this

    createEmbed(url: string): HTMLElement {
        switch (this.plugin.settings.fallbackOptions) {
            case FallbackOptions.ShowErrorMessage:
                return this.onErrorCreatingEmbed();
            case FallbackOptions.EmbedLink:
            {        
                // Creating the iframe
                const iframe = createEl("iframe");
                
                iframe.src = url;
                iframe.setAttribute("loading", "lazy");
                iframe.setAttribute("allowfullscreen", "true");
                iframe.setAttribute("allowtransparency", "true");
                
                iframe.classList.add(this.autoEmbedCssClass, "default-fallback-embed");

                return iframe;
            }
            case FallbackOptions.Hide:
                return createEl("span", {cls: "auto-embed-hide"});
        }
    }
} 