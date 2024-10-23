import { SupportedWebsites } from "src/settings-tab";
import { EmbedBase } from "./embedBase";

export class InstagramEmbed extends EmbedBase {
    name: SupportedWebsites = "Instagram";
    hostnames =  ["instagram.com"];
    regex = new RegExp(/https:\/\/(?:www\.)?instagram\.com\/(?:(?:(?:[\w._(?:[\w._]+\/)?(?:p|reel)\/([\w\-_]+))|(?:[\w._(?:[\w._]+))/);

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed(url);

        // Creating the iframe
        const iframe = createEl("iframe");
        
        const isProfile = regexMatch[1] === undefined;

        // Set the original regex to not capture profile
        if (isProfile) {
            const profileMatch = url.match(/https:\/\/(?:www\.)?instagram\.com\/([\w._(?:[\w._]+)/);
            if (profileMatch === null)
                return this.onErrorCreatingEmbed(url);

            iframe.src = `https://instagram.com/${profileMatch[1]}/embed/`;
            iframe.classList.add("instagram-profile");
        }
        else {
            iframe.src = `https://instagram.com/reel/${regexMatch[1]}/embed/`;
        }

        iframe.classList.add(this.autoEmbedCssClass);
        iframe.dataset.containerClass = "instagram-embed";
        iframe.setAttribute("scrolling", "no");

        function resizeEmbed() {
            if (isProfile) {
                iframe.style.height = (0.7 * iframe.offsetWidth + 200) + "px";
            }
            else {
                // iframe.style.height = (0.563 * iframe.offsetWidth + 206) + "px";
                iframe.style.height = (1.25 * iframe.offsetWidth + 208) + "px";
            }
        }

        resizeEmbed();
        new ResizeObserver(resizeEmbed).observe(iframe)
        return iframe;
    }
} 