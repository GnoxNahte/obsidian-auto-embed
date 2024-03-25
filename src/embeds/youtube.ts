import { EmbedBase } from "./embedBase";

// NOTE: Not maintained since using Obsidian's embeds
export class YouTubeEmbed extends EmbedBase {
    name = "YouTube";
    // Base from: https://stackoverflow.com/a/61033353/21099543
    // Added
    // - capture group for and support for video types (short, live, etc)
    // - capture group for timestamp (e.g. ?t=20s)
    // TODO:
    // - Add support for ignoring si=___id____. Think its for session id, is shown when user clicks the share button and copy the link.
    // Full link to test: https://gist.github.com/rodrigoborgesdeoliveira/987683cfbfcc8d800192da1e73adc486
    regex = new RegExp(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*\b(watch|embed|shorts|v|e|live)\b(?:(?:(?=\/[-a-zA-Z0-9_]{11,}(?!\S))\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})(?:(?:\?|&)t=(\d+)s?)?/);
    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");

        const videoType = regexMatch[1]; // check if its a shorts
        const videoId = regexMatch[2];
        // console.log(regexMatch);
        if (videoId === undefined)
        {
            return this.onErrorCreatingEmbed();
        }

        url = "https://www.youtube.com/embed/" + videoId;

        // Add timestamp
        if (regexMatch.length >= 4) 
            url += "?start=" + regexMatch[3];
        
        iframe.src = url;
        iframe.classList.add(
            this.autoEmbedCssClass, 
            "youtube" + (videoType === "shorts" ? "-shorts" : "") + "-embed"
        );

        return iframe;
    }
} 