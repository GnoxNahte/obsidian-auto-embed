import { EmbedBase } from "./embedBase";

export class ImgurEmbed extends EmbedBase {
    name = "Imgur";
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

        iframe.classList.add(this.autoEmbedCssClass, "imgur-embed", "imgur-" + imgurId);
        
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
        // Why use class instead of id for getting the reference:
        // There might be multiple iframes, some in Reading mode and Live preview.
        // Some might even duplicates if they user has duplicates
        const iframes = document.getElementsByClassName("imgur-" + imgurId);

        if (iframes.length === 0)
            return;
        
        for (let i = 0; i < iframes.length; ++i) {
            const iframe = iframes[i] as HTMLIFrameElement;
            
            iframe.height = data.height + "px";
            iframe.width = data.width + "px";
        }
        
    }
} 