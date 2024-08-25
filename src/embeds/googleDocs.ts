import { GoogleDocsViewOptions, SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class GoogleDocsEmbed extends EmbedBase {
    name: SupportedWebsites = "Google Docs";
    regex = new RegExp(/https:\/\/docs\.google\.com\/document\/d\/(\w+)/);

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");
        iframe.src = `https://docs.google.com/document/d/${regexMatch[1]}`;

        const viewOption = this.plugin.settings.googleDocsViewOption;
        switch (viewOption) {
            case GoogleDocsViewOptions.Preview: 
                iframe.src += "/preview"; 
                iframe.classList.add("google-docs-embed-preview");
                break;
            case GoogleDocsViewOptions.EditMinimal:
                iframe.src += "?rm=minimal"; 
                iframe.classList.add("google-docs-embed-edit-minimal");
                break;
            // If edit default or some other option, don't modify the src
            case GoogleDocsViewOptions.EditDefault: 
            default:
                iframe.classList.add("google-docs-embed-edit-default");
                break;
        }

        iframe.classList.add(this.autoEmbedCssClass);

        return iframe;
    }
} 