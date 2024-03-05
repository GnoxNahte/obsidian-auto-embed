import { PluginSettings } from "main";

export interface EmbedBase {
    readonly name: string;
    // To identify if the anchor link matches the embed type
    readonly regex: RegExp; 

    createEmbed(
        link: string,
        container: HTMLElement,
        settings: Readonly<PluginSettings>,
      ): HTMLElement;
}