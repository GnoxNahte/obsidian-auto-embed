import { EmbedBase } from "./embedBase";

export class TikTokEmbed extends EmbedBase {
    name = "TikTok";
    embedOrigin = "https://www.tiktok.com"
    regex = new RegExp(/https:\/\/www\.tiktok\.com\/\@([\w\.]+)\/video\/(\d+)/);

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Creating the iframe
        const iframe = createEl("iframe");

        const tiktokId = regexMatch[2];

        iframe.src = `https://www.tiktok.com/embed/v2/${tiktokId}/`;

        iframe.classList.add(this.autoEmbedCssClass, "tiktok-embed");
        // iframe.dataset.tiktokId = tiktokId;
        iframe.setAttribute("allowfullscreen", "");

        return iframe;
    }

    onResizeMessage(e: MessageEvent): void {
        // Tiktok format:  
        /*
            { 
                "signalSource" : string;
                "height" : number;
            }
        */

        // Ignore this message event
        if (e.data === "[tea-sdk]ready")
            return;

        let data;
        try {
            data = JSON.parse(e.data);
            // console.log("data: " + e.data)
        } catch (error) {
            console.error("Cannot parse tiktok json:\n" + error);
            return;
        }

        const height = data.height;
        if (!height)
            return;

        const iframes = document.getElementsByClassName("tiktok-embed") as HTMLCollectionOf<HTMLIFrameElement>;
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            // Check where the message came from
            if (iframe.contentWindow == e.source)
            {
                iframe.style.height = data.height + "px";
                break;
            }

            // console.log("Height: " + iframe.style.height);
        }
    }
} 