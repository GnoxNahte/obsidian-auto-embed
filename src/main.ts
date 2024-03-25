import { CodepenEmbed } from 'src/embeds/codepen';
import { TwitterEmbed } from 'src/embeds/twitter';
import { EmbedBase } from 'src/embeds/embedBase';
import { Editor, EditorPosition, Plugin } from 'obsidian';
import { YouTubeEmbed } from 'src/embeds/youtube';
import { SteamEmbed } from 'src/embeds/steam';
import { RedditEmbed } from 'src/embeds/reddit';
import { AutoEmbedSettingTab, DEFAULT_SETTINGS, PluginSettings } from 'src/settings-tab';
import { ImgurEmbed } from 'src/embeds/imgur';
import { SpotifyEmbed } from 'src/embeds/spotify';
import SuggestEmbed from 'src/suggestEmbed';
import { isURL, regexUrl } from 'src/utility';
import { embedField } from './embed-state-field';
import { EmbedManager } from './embeds/embedManager';

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
	isShiftDown = false;
	pasteInfo: PasteInfo = new PasteInfo(false, "");

	async onload() {
		// console.log('loading plugin');
		await this.loadSettings();

		const embedManager = EmbedManager.Instance;
		embedManager.init(this);

		this.registerEditorExtension(embedField);
		this.addSettingTab(new AutoEmbedSettingTab(this.app, this));
		
		// Remove while testing editor extension
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
			// console.log("Registering markdown")

			const images = el.querySelectorAll('img');
			images.forEach((image) => {
				if (image.referrerPolicy !== "no-referrer" || !isURL(image.src))
					return;

				this.handleImage(image);
			})
		})

		this.registerDomEvent(window, "message", (e: MessageEvent) => {
			// loop through / switch through all embed sources, checking which one sent it
			for (const source of EmbedManager.Instance.embedSources) {
				console.log(source.embedOrigin  + " | " + e.origin);
				if (source.embedOrigin === e.origin && source.onResizeMessage) {
					// console.log("Origin: " + e.origin);
					// console.log("Data: " + e.data);
					source.onResizeMessage(e);
					break;
				}
			}
		});
	}

	onunload() {
		// console.log('unloading plugin');
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

	// Creates the embed and replaces the Anchor element with it
	// Returns null if it's unable to convert it to an embed
	handleImage(img: HTMLImageElement): HTMLElement | null { 
		const alt = img.alt;
	
		const noEmbedRegex = /noembed/i;
		if (noEmbedRegex.test(alt)) {
			img.alt = alt.replace(noEmbedRegex, "");
			return null;
		}

		const src = img.src;

		const embedData = EmbedManager.getEmbedData(src, alt);

		// console.log(embedData);
		if (embedData === null) {
			return null;
		}
		const embed = embedData.embedSource.createEmbed(src);
		embedData.embedSource.applyModifications(embed, embedData);

		// Insert embed
		const parent = img.parentElement;
		parent?.replaceChild(embed, img);

		return embed;
	}

	// // Replaces Obsidian's iframes for YouTube and Twitter. Makes it so the user can apply the same options
	// // TODO: Consider deleting if not replacing YouTube and Twitter
	// private handleIFrame(iframe: HTMLIFrameElement): HTMLElement | null { 
	// 	const src = iframe.src;

	// 	const embedSource = EmbedManager.getEmbedData(src, "");

	// 	if (embedSource === null) {
	// 		return null;
	// 	}
	// 	console.log("Found! : " + src);
	// 	const embed = embedSource.createEmbed(src);

	// 	// Insert embed
	// 	const parent = iframe.parentElement;
	// 	parent?.replaceChild(embed, iframe);

	// 	return embed;
	// }

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
		// console.log("line text: "+ lineText)
		const matchedLinks = lineText.matchAll(regexUrl);
		for (const match of matchedLinks) {
			// console.log("match: " + match[0])
			// Check if the cursor is within the match
			// console.log("start: " + match.index + "|end: " + (match.index??0 + match[0].length) + "|cursor: "+ cursor.ch);
			if (match.index && 
				match.index <= cursor.ch && // Is start of match before cursor
				match.index + match[0].length >= cursor.ch // Is end of match after cursor
				) {
					// console.log("Selected: " + match[0]);
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
		editor.replaceRange(`![](${selection.text})`, selection.start, selection.end);
		
		// console.log(`Replacing to ![](${selection}), Start:${selection.start.ch}, End: ${selection.end.ch}`)
	}

	isLiveViewSupported() {
		if ((this.app.vault as any).config?.livePreview) {
			console.log("Live view is supported");
		}
		else {
			console.log("Live view is not supported");
		}
	}
}
