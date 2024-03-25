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

        const postId = url.match(/(?:\/comments\/)(\w+)/) as RegExpMatchArray;

        // Creating the iframe
        const iframe = createEl("iframe");
        
        iframe.classList.add(this.autoEmbedCssClass, "reddit-embed", "reddit-" + postId[1]);
        
        url = url.replace("www.reddit.com", "reddit.com"); // Remove "www"
        url = url.replace("reddit.com", "embed.reddit.com"); // Add embed subdomain
        
        if (this.plugin.settings.darkMode)
        {
             // If it already has the query marker "?", add to the query with the theme, else just add the query
            url += (url.contains('?') ? "&" : "?") + "theme=dark";
        }

        iframe.src = url;
        
        // TODO: Dynamically set iframe height:
        // Methods:
        //      - Listen to reddit's postmessage, reddit sends out a postmessage containing:
        //          {
        //              type: "resize.embed"
        //              data: [height value]
        //          }
        //          But it doesn't send the post id, so I'm not sure which iframe to set it to. 
        //      - Get height from reddit api? Not sure how to do
        //      - Get content type from reddit api? Main heights are: 
        //          - short text: 240px 
        //          - long text (has a show more dropdown): 316px 
        //          - picture / video: 739px 

        // iframe.style.height="unset";

        return iframe;
    }

    onResizeMessage(e: MessageEvent) {

        const data = JSON.parse(e.data);
        // console.log("data: " + e.data)
        // Only continue if the method is for resizing
        if (data.type !== "resize.embed")
            return;

        const iframes = document.getElementsByClassName("reddit-embed") as HTMLCollectionOf<HTMLIFrameElement>;
        if (iframes.length <= 1 || this.plugin.settings.redditAutoSize)
        {
            for (let i = 0; i < iframes.length; i++) {
                const iframe = iframes[i];
                // console.log("height:" + iframe.style.height);
                // console.log("Set: " + iframe.id + " to " + data.data);
                if (iframe.style.height === "")
                {
                    iframe.style.height = data.data + "px";
                    break;
                }
                // console.log("Height: " + iframe.style.height);
            }
        }
    }
} 