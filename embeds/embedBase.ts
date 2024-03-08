import AutoEmbedPlugin from "main";

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
    
    // To have a embed source respond to the resize event:
    // - Set EmbedBase.embedOrigin (e.g. embedOrigin = "https://platform.twitter.com")
    // - Set body of resize method here (onResizeMessage)
    onResizeMessage?(e: MessageEvent):void;

    onErrorCreatingEmbed(): HTMLElement {
        const errorMsg = `Error with ${this.name} url`;
        const error = createEl("p", {cls: `${this.autoEmbedCssClass} error-embed`});
        error.setText(errorMsg);

        console.log(errorMsg);
        return error;
    }
}