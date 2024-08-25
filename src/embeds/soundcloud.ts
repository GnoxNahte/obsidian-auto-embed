import { SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class SoundCloudEmbed extends EmbedBase {
    name: SupportedWebsites = "SoundCloud";
    regex = new RegExp(/https:\/\/soundcloud\.com\/(.*)/);
    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");

        iframe.src = `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${regexMatch[1]}`;

        iframe.classList.add(this.autoEmbedCssClass, "soundcloud-embed");

        return iframe;
    }
} 