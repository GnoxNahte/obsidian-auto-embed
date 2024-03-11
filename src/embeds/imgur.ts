import { EmbedBase } from "./embedBase";

export class ImgurEmbed extends EmbedBase {
    name = "Steam";
    regex = new RegExp(/https:\/\/imgur\.com\/gallery\/(\w+)/);
    embedOrigin = "https://imgur.com";

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        const imgurId = regexMatch[1];

        // Creating the iframe
        const iframe = createEl("iframe");

        iframe.src = `https://imgur.com/a/${imgurId}/embed?pub=true`;

        iframe.classList.add(this.autoEmbedCssClass, "imgur-embed");
        iframe.id = "imgur-" + imgurId;
        
        iframe.setAttribute("scrolling", "no");
        
        return iframe;
    }   
    
    onResizeMessage(e: MessageEvent) {
        const data = JSON.parse(e.data);
        if (data.message !== "resize_imgur")
            return;
    
        const href = data.href as string;
        const regexMatch = href.match(/https:\/\/imgur\.com\/a\/(\w+)/);
        if (!regexMatch || regexMatch.length < 2)
            return;
    
        const imgurId = regexMatch[1];
        const iframe = document.getElementById("imgur-" + imgurId) as HTMLIFrameElement;
        if (iframe === null)
            return;
        
        iframe.style.height = data.height + "px";
        iframe.style.width = data.width + "px";
    }
} 