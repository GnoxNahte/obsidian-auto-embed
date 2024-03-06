import { EmbedBase } from "./embedBase";

export class TwitterEmbed extends EmbedBase {
    name = "Twitter";
    regex = new RegExp(/https:\/\/(?:x|twitter)\.com\/\w+\/status\/(\w+)/);

    onload(): void {
        window.addEventListener("message", this.listenForTwitterResize);
    }

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();
        
        // Creating the iframe
        const iframe = createEl("iframe");
        const postId = regexMatch[1];

        url = `https://platform.twitter.com/embed/Tweet.html?dnt=true&theme=${this.plugin.settings.darkMode ? "dark" : "light"}&id=${postId}`;
        iframe.src = url;

        iframe.id += "twitter-" + postId;
        iframe.classList.add(this.autoEmbedCssClass, "twitter-embed");

        iframe.sandbox.add("allow-forms", "allow-presentation", "allow-same-origin", "allow-scripts", "allow-modals", "allow-popups");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("allowfullscreen", "");

        return iframe;
    }

    onunload() : void {
        window.removeEventListener("message", this.listenForTwitterResize);
    }

    listenForTwitterResize(e: MessageEvent) {
        console.log("Origin: " + e.origin);
        console.log("Data: " + e.data);
        if (e.origin !== "https://platform.twitter.com")
            return;
    
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
        // To visualise the data:
        // console.log(e.data);

       // Only continue if the method is for resizing
        if (e.data["twttr.embed"]["method"] !== "twttr.private.resize")
            return;
        
        const params = e.data["twttr.embed"]["params"][0];

        const iframe = document.getElementById("twitter-" + params["data"]["tweet_id"]) as HTMLIFrameElement;
        console.log("Tweet-id: " + params["data"]["tweet_id"]);
        if (iframe === null)
            return;
        
        iframe.style.height = params["height"] + "px";
        iframe.style.width = params["width"] + "px";
    }
} 