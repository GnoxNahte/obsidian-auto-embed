import { EditorView, WidgetType } from "@codemirror/view"
import { BaseEmbedData } from "./embeds/embedBase";

// For Live Preview
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
        const embed = this.embedData.embedSource.createEmbed(this.url, this.embedData);
        this.embedData.embedSource.applyModifications(embed, this.embedData);
        return embed;
    }
    
    eq(other: EmbedWidget) {
        return this.url === other.url && 
        (
            this.embedData.width === other.embedData.width &&
            this.embedData.height === other.embedData.height
        );
    }
}
