import AutoEmbedPlugin from "src/main";

export class BaseEmbedData {
    embedSource: EmbedBase;
    // TODO: Add url
    originalString?: string;
    shouldEmbed: boolean;
    width?: string;
    height?: string;

    constructor(embedSource: EmbedBase, originalString: string) {
        this.embedSource = embedSource;
        this.originalString = originalString;
        this.shouldEmbed = true;
    }
}

export abstract class EmbedBase {
    readonly autoEmbedCssClass: string = "auto-embed";
    readonly name: string;
    // To identify if the anchor link matches the embed type
    readonly regex: RegExp; 
    // Embed websites usually post a resize message.
    // This is to identify which website sent the message. 
    // If the website doesn't need / doesn't send the message, it'll be undefined.
    readonly embedOrigin?: string;
    readonly plugin: AutoEmbedPlugin;
    
    constructor(plugin: AutoEmbedPlugin) {
        this.plugin = plugin;
    }
    
    abstract createEmbed(link: string): HTMLElement;

    getOptions(alt: string): BaseEmbedData {
        const options: BaseEmbedData = new BaseEmbedData(this, alt);

        if (!alt)
            return options;

        // Check if the user specified that the match is inside the brackets
        // TODO: Add this feature to README.md
        const specifiedMatch = alt.match(/{(\w+)}/);
        if (specifiedMatch)
            alt = specifiedMatch[1];

        // Don't need to check the rest since not embedding.
        if (alt.match(/noembed/)) {
            options.shouldEmbed = false;
            return options;
        }
        else {
            options.shouldEmbed = true;
        }

        const widthMatch = alt.match(/(?:w|width)\s*(?::|=)\s*(\d+(?:\%|\w+))/);
        if (widthMatch)
            options.width = widthMatch[1];

        const heightMatch = alt.match(/(?:h|height)\s*(?::|=)\s*(\d+(?:\%|\w+))/);
        if (heightMatch)
            options.height = heightMatch[1];

        return options;
    }

    applyOptions(el: HTMLElement, data: BaseEmbedData) {
        if (data.width)
            el.style.width = data.width;

        if (data.height)
            el.style.height = data.height;
    }
    
    // To have a embed source respond to the resize event:
    // - Set EmbedBase.embedOrigin (e.g. embedOrigin = "https://platform.twitter.com")
    // - Set body of resize method here (onResizeMessage)
    onResizeMessage?(e: MessageEvent):void;

    onErrorCreatingEmbed(msg?: string): HTMLElement {
        const errorMsg = msg ?? `Error with ${this.name} url`;
        const error = createEl("p", {cls: `${this.autoEmbedCssClass} error-embed`});
        error.setText(errorMsg);

        console.log(errorMsg);
        return error;
    }
}