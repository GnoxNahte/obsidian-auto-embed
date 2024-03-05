import { PluginSettings } from "main";
import { EmbedBase } from "./embedBase";

export class CodepenEmbed extends EmbedBase {
    name = "CodePen";
    regex = new RegExp(/https:\/\/codepen\.io\/(\w+)\/pen\/(\w+)(\?.*)?/);

    createEmbed(url: string, settings: Readonly<PluginSettings>): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");

        iframe.src = `https://codepen.io/${regexMatch[1]}/embed/${regexMatch[2]}?default-tab=result&editable=true`;

        iframe.classList.add("auto-embed", "codepen-embed");

        return iframe;
    }
} 