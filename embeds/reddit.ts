import { PluginSettings } from "main";
import { EmbedBase } from "./embedBase";

export class RedditEmbed extends EmbedBase {
    name = "Reddit";
    regex = new RegExp(/reddit.com/);

    // onload(): void {
    //     window.addEventListener("message", this.listenForRedditResize);
    // }

    createEmbed(url: string, settings: Readonly<PluginSettings>): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        const postId = url.match(/(?:\/comments\/)(\w+)/) as RegExpMatchArray;

        // Creating the iframe
        const iframe = createEl("iframe");

        url = url.replace("www.reddit.com", "reddit.com"); // Remove "www"
        url = url.replace("reddit.com", "embed.reddit.com"); // Add embed subdomain
        iframe.src = url;

        iframe.classList.add(this.autoEmbedCssClass, "reddit-embed");
        iframe.id += "reddit-" + postId[1];

        return iframe;
    }

    // onunload() : void {
    //     window.removeEventListener("message", this.listenForRedditResize);
    // }

    // listenForRedditResize(e: MessageEvent) {
    //     if (e.origin !== "https://embed.reddit.com")
    //         return;
    //     console.log("Path: " + e.composedPath());
    //     const data = JSON.parse(e.data);

    //     // Only continue if the method is for resizing
    //     if (data.type !== "resize.embed")
    //         return;

    //     const iframes = document.getElementsByClassName("reddit-embed") as HTMLCollectionOf<HTMLIFrameElement>;
    //     for (let i = 0; i < iframes.length; i++) {
    //         const iframe = iframes[i];
    //         // console.log("height:" + iframe.style.height);
    //         if (iframe.style.height === "unset")
    //         {
    //             console.log("Set: " + iframe.id + " to " + data.data);
    //             iframe.style.height = data.data + "px";
    //             break;
    //         }
    //     }

    //     // const iframe = document.getElementById("twitter-" + params["data"]["tweet_id"]) as HTMLIFrameElement;
    //     // console.log("Tweet-id: " + params["data"]["tweet_id"]);
    //     // if (iframe === null)
    //     //     return;
        
    //     // iframe.style.height = params["height"] + "px";
    //     // iframe.style.width = params["width"] + "px";
    // }
} 