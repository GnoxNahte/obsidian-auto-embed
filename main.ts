import { CodepenEmbed } from 'embeds/codepen';
import { TwitterEmbed } from 'embeds/twitter';
import { EmbedBase } from 'embeds/embedBase';
import { Editor, EditorPosition, Plugin } from 'obsidian';
import { YouTubeEmbed } from 'embeds/youtube';
import { SteamEmbed } from 'embeds/steam';
import { RedditEmbed } from 'embeds/reddit';
import { AutoEmbedSettingTab, DEFAULT_SETTINGS, PluginSettings } from 'settings-tab';
import { ImgurEmbed } from 'embeds/imgur';
import { SpotifyEmbed } from 'embeds/spotify';
import SuggestEmbed from 'suggestEmbed';
import { isURL, regexUrl } from 'utility';

class PasteInfo {
	trigger: boolean;
	text: string;

	constructor(trigger: boolean, text: string) {
		this.trigger = trigger;
		this.text = text;
	}
}

interface Selection {
	start: EditorPosition
	end: EditorPosition
	text: string;
}

export default class AutoEmbedPlugin extends Plugin {
	settings: PluginSettings;
	embedSources: EmbedBase[] = [
		new TwitterEmbed(this),
		new RedditEmbed(this),
		new YouTubeEmbed(this),
		new SteamEmbed(this),
		new CodepenEmbed(this),
		new SpotifyEmbed(this),
		new ImgurEmbed(this),
	];
	isShiftDown = false;
	pasteInfo: PasteInfo = new PasteInfo(false, "");

	async onload() {
		console.log('loading plugin');
		await this.loadSettings();

		this.addSettingTab(new AutoEmbedSettingTab(this.app, this));

		this.registerDomEvent(document, "keydown", (e) => {
			if (e.shiftKey)
				this.isShiftDown = true;
		})

		this.registerDomEvent(document, "keydown", (e) => {
			if (!e.shiftKey)
				this.isShiftDown = false;
		})

		this.registerEditorSuggest(new SuggestEmbed(this));
		
		this.app.workspace.on("editor-paste", this.onPaste.bind(this));
		
		this.registerMarkdownPostProcessor((el, ctx) => {
			console.log("Registering markdown")
			const anchors = el.querySelectorAll('a.external-link') as NodeListOf<HTMLAnchorElement>;
			anchors.forEach((anchor) => {
				this.handleAnchor(anchor);
			})
		})

		this.registerDomEvent(window, "message", (e: MessageEvent) => {
			// loop through / switch through all embed sources, checking which one sent it
			for (const source of this.embedSources) {
				console.log(source.embedOrigin  + " | " + e.origin);
				if (source.embedOrigin === e.origin && source.onResizeMessage) {
					console.log("Origin: " + e.origin);
					console.log("Data: " + e.data);
					source.onResizeMessage(e);
					break;
				}
			}
		});
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private onPaste(e: ClipboardEvent, editor: Editor) {
		if (e.defaultPrevented)
			return;

		// Usually "Ctrl-Shift-V" means paste text without formatting. So don't embed
		if (this.isShiftDown) 
			return;
		
		// Check if valid url
		const clipboardData = e.clipboardData?.getData("text/plain");
		if (!clipboardData || clipboardData === "" || !isURL(clipboardData))
			return;

		this.pasteInfo.trigger = true;
		this.pasteInfo.text = clipboardData;
	}

	private handleAnchor(a: HTMLAnchorElement) { 
		const innerText = a.innerText;
		// Removes all spaces
		const innerTextTrim = innerText.replace(/\s/g, "");
		
		if (!innerTextTrim.includes("ae:embed")) {
			return;
		}	

		const href = a.href;
		
		console.log("Testing: " + href);
		const embedSource = this.embedSources.find((source) => {
			return source.regex.test(href);
		})

		if (embedSource === undefined) {
			return;
		}
		console.log("Found! : " + href);
		const embed = this.createEmbed(embedSource, href);

		// Insert embed
		const parent = a.parentElement;
		parent?.replaceChild(embed, a);
	}

	private getSelection(editor: Editor) : Selection | null {
		if (!editor.somethingSelected())
			return null;
		
		return {
			start: editor.getCursor("from"),
			end: editor.getCursor("to"),
			text: editor.getSelection()
		}
	}

	// Used if there's nothing selected. Mostly when the user pastes a link
	getLinkSelection(editor: Editor): Selection | null {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line); 
		console.log("line text: "+ lineText)
		const matchedLinks = lineText.matchAll(regexUrl);
		for (const match of matchedLinks) {
			console.log("match: " + match[0])
			// Check if the cursor is within the match
			console.log("start: " + match.index + "|end: " + (match.index??0 + match[0].length) + "|cursor: "+ cursor.ch);
			if (match.index && 
				match.index <= cursor.ch && // Is start of match before cursor
				match.index + match[0].length >= cursor.ch // Is end of match after cursor
				) {
					console.log("Selected: " + match[0]);
					return {
						start: {
							line: cursor.line,
							ch: match.index
						},
						end: {
							line: cursor.line,
							ch: match.index + match[0].length
						},
						text: match[0]
					}
				}
		}

		return null;
	}

	markToEmbed(selection: Selection, editor: Editor) {
		// TODO: Consider hiding ae:embed? but then will make viewing in [source mode] messy
		// editor.replaceRange(`[<span style="display:none">ae:embed</span>${selection.text}](${selection.text})`, selection.start, selection.end);
		editor.replaceRange(`[${selection.text}](${selection.text})`, selection.start, selection.end);
		
		console.log(`Replacing: [ae:embed](${selection}), Start:${selection.start.ch}, End: ${selection.end.ch}`)
	}

	private createEmbed(embedSource: EmbedBase, link: string) {
		const embed = embedSource.createEmbed(link);
		return embed; 
	}

	private insertEmbed(a: HTMLAnchorElement, container: HTMLElement) {
		const parent = a.parentElement;
		parent?.replaceChild(container, a);
	}
}

