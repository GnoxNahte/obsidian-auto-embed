import AutoEmbedPlugin from "src/main";
import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile } from "obsidian";

class Suggestion {
    static readonly embedLinkChoice = "Embed Link";
    static readonly cancelChoice = "Cancel";
    // static readonly choices = [this.embedLinkChoice, this.cancelChoice];
    choice: string;

    constructor(choice: string) {
        // if (Suggestion.choices.includes(choice))
        //     console.warn(`Choice [${choice}] is not in the choices array. Check if its a valid choice`);
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
        // This function is called for every key stroke so if possible, quickly return if its not affecting this plugin.
        if (!this.plugin.pasteInfo.trigger)
            return null;
        
        this.editor = editor;

        this.plugin.pasteInfo.trigger = false;

        return {
            start: cursor,
            end: cursor,
            query: this.plugin.pasteInfo.text,
        }
    }

    getSuggestions(context: EditorSuggestContext): Suggestion[] | Promise<Suggestion[]> {
        return [new Suggestion("Embed Link"), new Suggestion("Cancel")];
    }

    renderSuggestion(suggestion: Suggestion, el: HTMLElement): void {
        el.setText(suggestion.choice);
    }

    selectSuggestion(suggestion: Suggestion, e: KeyboardEvent | MouseEvent): void {
        const cursor = this.editor.getCursor();

        switch (suggestion.choice) {
            case Suggestion.embedLinkChoice:
                {
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
                break;
            case Suggestion.cancelChoice:
                break;
            default:
                console.warn("Unknown suggestion - " + suggestion.choice + "?")
                break;
        }

        this.close();
    }
}