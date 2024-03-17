import { syntaxTree } from "@codemirror/language"
import { Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"
import { EmbedWidget } from "./embed-widget";
import { EmbedManager } from "./embeds/embedManager";
import { editorLivePreviewField } from "obsidian";

export const embedField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        console.log("C")
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();
        
        if (!transaction.state.field(editorLivePreviewField))
            return builder.finish();
        
        const selections = transaction.selection?.ranges.map(range => [range.from, range.to]) ?? [];
        syntaxTree(transaction.state).iterate({
            
            enter(node) {
                // console.log("Type: " + node.type.name)
                if (node.type.name.startsWith("string_url")) {
                    // Don't render when the cursor is on the line.
                    const overlaps = selections.filter(([from, to]) => (to >= node.from - 1 && from <= node.to + 1));
                    if (overlaps.length > 0) {
                        console.log("Return")
                        return;
                    }
                    console.log("word at: " + transaction.state.wordAt(node.from)?.toJSON());
                    if (transaction.state.sliceDoc(node.from - 4, node.from - 3) !== "!")
                        return;

                    const url = transaction.state.sliceDoc(node.from, node.to);
                    const alt = ""; // TODO
                    const embedSource = EmbedManager.getEmbedSource(url, alt);
                    console.log("Source: " + embedSource)

                    if (embedSource === null)
                        return;

                    const replaceFrom = node.to + 1;
                    
                    builder.add(
                        replaceFrom,
                        replaceFrom + 1,
                        Decoration.replace({
                            widget: new EmbedWidget(embedSource, url, alt),
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

// import { syntaxTree } from "@codemirror/language";
// import { RangeSetBuilder } from "@codemirror/state";
// import {
//   Decoration,
//   DecorationSet,
//   EditorView,
//   PluginSpec,
//   PluginValue,
//   ViewPlugin,
//   ViewUpdate,
//   WidgetType,
// } from "@codemirror/view";
// import { EmbedWidget } from "./embed-widget";

// class EmojiListPlugin implements PluginValue {
//   decorations: DecorationSet;

//   constructor(view: EditorView) {
//     this.decorations = this.buildDecorations(view);
//   }

//   update(update: ViewUpdate) {
//     if (update.docChanged || update.viewportChanged) {
//       this.decorations = this.buildDecorations(update.view);
//     }
//   }

//   destroy() {}

//   buildDecorations(view: EditorView): DecorationSet {
//     const builder = new RangeSetBuilder<Decoration>();

//     for (let { from, to } of view.visibleRanges) {
//       syntaxTree(view.state).iterate({
//         from,
//         to,
//         enter(node) {

//             console.log("Type (State): " + node.type.name)
//           if (node.type.name.startsWith("list")) {
//             // Position of the '-' or the '*'.
//             const listCharFrom = node.from - 2;

//             builder.add(
//               listCharFrom,
//               listCharFrom + 1,
//               Decoration.replace({
//                 widget: new EmbedWidget(),
//               })
//             );
//           }
//         },
//       });
//     }

//     return builder.finish();
//   }
// }

// const pluginSpec: PluginSpec<EmojiListPlugin> = {
//   decorations: (value: EmojiListPlugin) => value.decorations,
// };

// export const emojiListPlugin = ViewPlugin.fromClass(
//   EmojiListPlugin,
//   pluginSpec
// );