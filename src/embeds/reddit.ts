import { EmbedBase } from "./embedBase";

export class RedditEmbed extends EmbedBase {
    name = "Reddit";
    regex = new RegExp(/reddit.com/);
    embedOrigin = "https://embed.reddit.com";

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        const postIdRegexResult = url.match(/(?:\/comments\/)(\w+)/) as RegExpMatchArray;
        if (!postIdRegexResult)
        {
            return this.onErrorCreatingEmbed();
        }
        const postId = postIdRegexResult[1];

        // Creating the iframe
        const iframe = createEl("iframe");
        
        iframe.classList.add(this.autoEmbedCssClass, "reddit-embed", "reddit-" + postId[1]);
        
        url = url.replace("www.reddit.com", "embed.reddit.com"); // Remove "www"
        
        if (this.plugin.settings.darkMode)
        {
             // If it already has the query marker "?", add to the query with the theme, else just add the query
            url += (url.contains('?') ? "&" : "?") + "theme=dark";
        }

        iframe.src = url;
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("allowfullscreen", "");
        
        // console.log("Cache: " + JSON.stringify(this.sizeCache))
        iframe.dataset.redditPostId = postId;
        if (this.sizeCache[postId] && this.sizeCache[postId].height) {
            iframe.style.height = this.sizeCache[postId].height + "px";
        }

        // iframe.style.height="unset";

        return iframe;
    }

    onResizeMessage(e: MessageEvent) {
        let data;
        try {
            data = JSON.parse(e.data);
            // console.log("data: " + e.data)
        } catch (e) {
            console.log("Error parsing reddit message. Error: " + e);
            return;
        }

        // Only continue if the method is for resizing
        if (data.type !== "resize.embed")
            return;

        const iframes = document.getElementsByClassName("reddit-embed") as HTMLCollectionOf<HTMLIFrameElement>;
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            // Check where the message came from
            if (iframe.contentWindow == e.source)
            {
                const height = data.data;
                iframe.style.height = height + "px";
                
                const postId = iframe.dataset.redditPostId;
                if (postId) 
                    this.sizeCache[postId] = { width: 0, height: height};

                break;
            }
            // console.log("Height: " + iframe.style.height);
        }
    }
} 