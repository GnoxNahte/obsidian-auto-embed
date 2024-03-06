import { PluginSettings } from "main";

export abstract class EmbedBase {
    readonly autoEmbedCssClass: string = "auto-embed";
    readonly name: string;
    // To identify if the anchor link matches the embed type
    readonly regex: RegExp; 

    abstract createEmbed(
        link: string,
        settings: Readonly<PluginSettings>,
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