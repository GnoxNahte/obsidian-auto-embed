import { EditorView, WidgetType } from "@codemirror/view"
import { EmbedBase } from "./embeds/embedBase";
import { MarkdownView } from "obsidian";

export class EmbedWidget extends WidgetType {
    embedSource: EmbedBase;
    url: string;
    alt: string;
    constructor(embedSource: EmbedBase, url: string, alt: string) {
        super();
        this.embedSource = embedSource;
        this.url = url;
        this.alt = alt;
    }

    toDOM(view: EditorView): HTMLElement {
        const embed = this.embedSource.createEmbed(this.url);
        MarkdownView
        return embed;

        // const div = createDiv({text: "Embed Widget Text"});
        
        // return div;

        // const div = document.createElement("span");

        // div.innerText = "👉";

        // return div;
    }
    
    eq(other: EmbedWidget) {
        return other.url === this.url;
    }
}
