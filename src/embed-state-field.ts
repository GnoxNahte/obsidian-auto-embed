import { syntaxTree } from "@codemirror/language"
import { Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { EmbedWidget } from "./embed-widget";
import { EmbedManager } from "./embeds/embedManager";
import { editorLivePreviewField } from "obsidian";
import { isURL } from "./utility";

export const embedField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        
        if (!transaction.state.field(editorLivePreviewField))
            return builder.finish();
        
        // const selections = transaction.selection?.ranges.map(range => [range.from, range.to]) ?? [];
        let altTextStartPos: number | null = null;
        syntaxTree(transaction.state).iterate({
            enter(node) {
                // console.log("Type: " + node.type.name)
                if (node.type.name === "formatting_formatting-image_image_image-marker") {
                    altTextStartPos = node.to + 1;
                }
                else if (node.type.name === "string_url") {
                    // Don't render when the cursor is on the line.
                    // const overlaps = selections.filter(([from, to]) => (to >= node.from - 1 && from <= node.to + 1));
                    // if (overlaps.length > 0) {
                    //     console.log("Return")
                    //     return;
                    // }

                    const url = transaction.state.sliceDoc(node.from, node.to);
                    const alt = altTextStartPos ? transaction.state.sliceDoc(altTextStartPos, node.from - 2) : ""; // TODO
                    
                    altTextStartPos = null; // Reset it

                    if (!isURL(url))
                        return;

                    const embedData = EmbedManager.getEmbedData(url, alt);

                    if (embedData === null)
                        return;

                    const replaceFrom = node.to + 1;
                    
                    builder.add(
                        replaceFrom,
                        replaceFrom + 1,
                        Decoration.replace({
                            widget: new EmbedWidget(embedData, url, alt),
                        })
                    );
                }
            },
        });

        return builder.finish();
    },
    provide(field: StateField<DecorationSet>): Extension {
        return EditorView.decorations.from(field);
    }
})
