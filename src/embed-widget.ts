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
        const embedResult = this.embedData.embedSource.create(this.url, this.embedData);
        this.embedData.embedSource.applyModifications(embedResult, this.embedData);
        
        return embedResult.containerEl;
    }
    
    eq(other: EmbedWidget) {
        return this.url === other.url && 
        (
            this.embedData.width === other.embedData.width &&
            this.embedData.height === other.embedData.height
        ) && 
        this.alt === other.alt;
    }
}
