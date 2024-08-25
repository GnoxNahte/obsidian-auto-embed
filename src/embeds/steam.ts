import { SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class SteamEmbed extends EmbedBase {
    name: SupportedWebsites = "Steam";
    regex = new RegExp(/https:\/\/store\.steampowered\.com\/app\/(\d+)/);

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");

        iframe.src = `https://store.steampowered.com/widget/${regexMatch[1]}/`;

        iframe.classList.add(this.autoEmbedCssClass, "steam-embed");

        return iframe;
    }
} 