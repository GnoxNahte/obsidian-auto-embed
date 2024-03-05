import { PluginSettings } from "main";
import { EmbedBase } from "./embedBase";

export class YouTubeEmbed extends EmbedBase {
    name = "YouTube";
    // TODO: Fit more youtube urls (E.g. music, shorts, if it has playlists)
    // List (no need fit all): https://gist.github.com/rodrigoborgesdeoliveira/987683cfbfcc8d800192da1e73adc486
    regex = new RegExp(/https:\/\/(?:www\.?)youtube\.com\/\w+\?v=(\w+)/);

    createEmbed(url: string, settings: Readonly<PluginSettings>): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");

        url = "https://www.youtube.com/embed/" + regexMatch[1];

        iframe.src = url;

        iframe.classList.add("auto-embed", "youtube-embed");

        return iframe;
    }
} 