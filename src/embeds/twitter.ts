import { SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class TwitterEmbed extends EmbedBase {
    name: SupportedWebsites = "Twitter/X";
    // Don't parse twitter since Obsidian already handles that.
    regex = new RegExp(/https:\/\/(?:x)\.com\/(\w+)(?:\/status\/(\w+))?/);
    embedOrigin = "https://platform.twitter.com";

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed(url);
        
        // Creating the iframe
        const iframe = createEl("iframe");
        const postId = regexMatch[2];
        const isPost = postId !== undefined;
        
        // Embed post
        if (isPost)
            url = `https://platform.twitter.com/embed/Tweet.html?dnt=true&theme=${this.plugin.settings.darkMode ? "dark" : "light"}&id=${regexMatch[2]}`;
        // Embed profile timeline
        else
            url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${regexMatch[1]}?dnt=true`
        iframe.src = url;

        iframe.classList.add(this.autoEmbedCssClass);
        iframe.dataset.containerClass = "twitter-embed";

        iframe.sandbox.add("allow-forms", "allow-presentation", "allow-same-origin", "allow-scripts", "allow-modals", "allow-popups");
        if (isPost)
            iframe.setAttribute("scrolling", "no");
        // iframe.setAttribute("allowfullscreen", "");

        iframe.dataset.twitterPostId = postId;
        if (this.sizeCache[postId] && this.sizeCache[postId].height) {
            iframe.style.height = this.sizeCache[postId].height + "px";
        }

        return iframe;
    }

    onResizeMessage(e: MessageEvent): void {
        // Twitter Params format:
        /*
        twttr.embed {
            id: string,
            jsonrpc: "2.0",
            method: string,
            params[]: 
            {
                width: number;
                height: number;
                data: {
                    tweet_id: string;
                };
            }
        }
        */

        // console.log("Twitter Message: " + JSON.stringify(e.data["twttr.embed"]))

       // Only continue if the method is for resizing
        if (e.data["twttr.embed"]["method"] !== "twttr.private.resize")
            return;
        
        const params = e.data["twttr.embed"]["params"][0];
        const postId = params["data"]["tweet_id"];
        // console.log("Tweet-id: " + params["data"]["tweet_id"]);

        // Why use querySelectorAll instead of querySelector for getting the reference:
        // There might be multiple iframes, some in Reading mode and Live preview.
        // Some might even duplicates if they user has duplicates
        const iframes = document.querySelectorAll(`.twitter-embed iframe[data-twitter-post-id="${postId}"]`);

        if (iframes.length === 0)
            return;
        
        for (let i = 0; i < iframes.length; ++i) {
            const iframe = iframes[i] as HTMLIFrameElement;
            
            const height = (params["height"] as number) + 1;
            // iframe.style.width = ((params["width"] as number) + 1) + "px";
            iframe.style.height = height + "px";
            
            this.resizeContainer(iframe, iframe.style.height);
            
            if (postId) 
                this.sizeCache[postId] = { width: 0, height: height};
        }
    }
} 