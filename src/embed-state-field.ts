import { syntaxTree } from "@codemirror/language"
import { Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView, WidgetType } from "@codemirror/view"
import { EmbedWidget } from "./embed-widget";

export const embedField = StateField.define<DecorationSet>({
    create(state): DecorationSet {
        return Decoration.none;
    },
    update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();

        syntaxTree(transaction.state).iterate({
            enter(node) {
                console.log("Type: " + node.type.name)
                if (node.type.name === "formatting_formatting-link-string_string_url") {
                    builder.add(
                        node.from,
                        node.to,
                        Decoration.replace({ widget: new EmbedWidget(), }) 
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