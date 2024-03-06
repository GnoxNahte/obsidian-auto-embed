import AutoEmbedPlugin from "main";

export abstract class EmbedBase {
    readonly autoEmbedCssClass: string = "auto-embed";
    readonly name: string;
    // To identify if the anchor link matches the embed type
    readonly regex: RegExp; 
    readonly plugin: AutoEmbedPlugin;

    constructor(plugin: AutoEmbedPlugin) {
        this.plugin = plugin;
    }
    
    abstract createEmbed(
        link: string,
    ): HTMLElement;

    onload?(): void;

    onunload?(): void;

    onErrorCreatingEmbed(): HTMLElement {
        const errorMsg = `Error with ${this.name} url`;
        const error = createEl("p", {cls: `${this.autoEmbedCssClass} error-embed`});
        error.setText(errorMsg);

        console.log(errorMsg);
        return error;
    }
}