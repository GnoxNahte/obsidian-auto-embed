import { EditorView, WidgetType } from "@codemirror/view"
import { BaseEmbedData, EmbedBase } from "./embeds/embedBase";
import { MarkdownView } from "obsidian";

export class EmbedWidget extends WidgetType {
    embedData: BaseEmbedData;
    url: string;
    alt: string;
    constructor(embedData: BaseEmbedData, url: string, alt: string) {
        super();
        this.embedData = embedData;
        this.url = url;
        this.alt = alt;
    }

    toDOM(view: EditorView): HTMLElement {
        const embed = this.embedData.embedSource.createEmbed(this.url);
        this.embedData.embedSource.applyOptions(embed, this.embedData);
        return embed;

        // const div = createDiv({text: "Embed Widget Text"});
        
        // return div;

        // const div = document.createElement("span");

        // div.innerText = "👉";

        // return div;
    }
    
    eq(other: EmbedWidget) {
        return this.url === other.url && 
        (
            this.embedData.width === other.embedData.width &&
            this.embedData.height === other.embedData.height
        );
    }
}
