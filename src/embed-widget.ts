import { EditorView, WidgetType } from "@codemirror/view"

export class EmbedWidget extends WidgetType {
    toDOM(view: EditorView): HTMLElement {
        // const div = createDiv({text: "Embed Widget Text"});
        
        // return div;

        const div = document.createElement("span");

        div.innerText = "👉";

        return div;
    }
}
