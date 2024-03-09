import AutoEmbedPlugin from "main";
import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile } from "obsidian";

class Suggestion {
    choice: string;

    constructor(choice: string) {
        this.choice = choice;
    }
}

export default class SuggestEmbed extends EditorSuggest<Suggestion> {
    private plugin: AutoEmbedPlugin;
    private editor: Editor;

    constructor(plugin: AutoEmbedPlugin) {
        super(plugin.app);
        this.plugin = plugin;
    }

    onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null): EditorSuggestTriggerInfo | null {
        console.log("on trigger");
        this.editor = editor;
        if (!this.plugin.pasteInfo.trigger)
            return null;

        this.plugin.pasteInfo.trigger = false;
        console.log("Cursor-ch: " + cursor.ch);

        return {
            start: cursor,
            end: cursor,
            query: this.plugin.pasteInfo.text,
        }
    }

    getSuggestions(context: EditorSuggestContext): Suggestion[] | Promise<Suggestion[]> {
        console.log("get suggestion");
        return [new Suggestion("Embed Link"), new Suggestion("Cancel")];
    }

    renderSuggestion(suggestion: Suggestion, el: HTMLElement): void {
        console.log("render suggestion");
        el.setText(suggestion.choice);
    }

    selectSuggestion(suggestion: Suggestion, e: KeyboardEvent | MouseEvent): void {
        console.log("select suggestion");
        const cursor = this.editor.getCursor();
        if (suggestion.choice === "Embed Link") {
            console.log("Selected create embed");
            const text = this.plugin.pasteInfo.text;
            this.plugin.markToEmbed(
                {
                    text: text,
                    start: {
                        line: cursor.line,
                        ch: cursor.ch - text.length
                    },
                    end: cursor
                }
                ,this.editor);
        }
        else 
            console.log("select suggestion: " + suggestion.choice);

        this.close();
    }
}