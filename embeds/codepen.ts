import { PluginSettings } from "main";
import { EmbedBase } from "./embedBase";

export class CodepenEmbed implements EmbedBase {
    name = "CodePen";
    regex = new RegExp(/https:\/\/codepen\.io\/(\w+)\/(?:pen)\/(\w+)/);

    createEmbed(link: string, container: HTMLElement, settings: Readonly<PluginSettings>): HTMLElement {
        const iframe = createEl("iframe", {parent: container});

        let url = link;
        if (link.contains("?"))
            url = link.substring(0, link.indexOf("?"));
        if (link.contains("/pen/"))
            url = url.replace("/pen/", "/embed/");

        iframe.src = url + "?default-tab=result&editable=true";
        // iframe.href = url + "?default-tab=result&editable=true";
        iframe.textContent = "Codepen";
        container.appendChild(iframe);
        container.classList.add("codepen");

        return iframe;
    }
}