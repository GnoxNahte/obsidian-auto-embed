import { SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class CodepenEmbed extends EmbedBase {
    name: SupportedWebsites = "CodePen";
    regex = new RegExp(/https:\/\/codepen\.io\/([\w-]+)\/pen\/(\w+)(\?.*)?/);

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed(url);

        // Creating the iframe
        const iframe = createEl("iframe");

        iframe.src = `https://codepen.io/${regexMatch[1]}/embed/${regexMatch[2]}?default-tab=result&editable=true`;

        iframe.classList.add(this.autoEmbedCssClass);
        iframe.dataset.containerClass = "codepen-embed";

        return iframe;
    }
} 