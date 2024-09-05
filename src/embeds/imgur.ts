import { SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class ImgurEmbed extends EmbedBase {
    name: SupportedWebsites = "Imgur";
    regex = new RegExp(/https:\/\/imgur\.com\/(?:(?:a|gallery|(?:t\/\w+))\/)?(\w+)/);
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
        iframe.dataset.imgurId = imgurId;
        if (this.sizeCache[imgurId] && this.sizeCache[imgurId].height) {
            iframe.style.height = this.sizeCache[imgurId].height + "px";
            
            // Optional
            if (this.sizeCache[imgurId].width)
                iframe.style.width = this.sizeCache[imgurId].width + "px";
        }
        
        iframe.setAttribute("scrolling", "no");
        
        return iframe;
    }   
    
    onResizeMessage(e: MessageEvent) {
        const data = JSON.parse(e.data);
        const href = data.href as string;
        const regexMatch = href.match(/https:\/\/imgur\.com\/(?:a\/)?(\w+)/);
    
        if (!regexMatch || regexMatch.length < 2)
            return;
        
        // console.log("Imgur data: " + JSON.stringify(data));
        
        const imgurId = regexMatch[1];
        // Why use querySelectorAll instead of querySelector for getting the reference:
        // There might be multiple iframes, some in Reading mode and Live preview.
        // Some might even duplicates if they user has duplicates
        const iframes = document.querySelectorAll(`.imgur-embed[data-imgur-id="${imgurId}"`);
        
        if (iframes.length === 0)
            return;

        for (let i = 0; i < iframes.length; ++i) {
            const iframe = iframes[i] as HTMLIFrameElement;
                
            if (data.message === "resize_imgur") {
                iframe.style.height = data.height + "px";
                iframe.style.width = data.width + "px";

                this.resizeContainer(iframe, iframe.style.height, iframe.style.width);

                this.sizeCache[imgurId] = { width: data.width, height: data.height };
            } 
            // ===== NOTE =====
            // Imgur has different embed urls for "albums" and "posts"
            // For Albums: "https://imgur.com/a/postID" - With "a/"
            // For Posts : "https://imgur.com/postID" - Without "a/"
            // Since I can't guess the type from the raw url, try album first because: https://www.reddit.com/r/OutOfTheLoop/comments/4vtt1j/why_is_every_upload_on_imgur_being_put_as_an/
            // If it sends a 404 error message, 
            // change the iframe src url to the post type, same url without "a/"
            else if (data.message === "404_imgur_embed") {
                iframe.src = iframe.src.replace("/a/", "/");
            } 
        }
    }
} 