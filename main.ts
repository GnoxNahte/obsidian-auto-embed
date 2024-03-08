import { CodepenEmbed } from 'embeds/codepen';
import { TwitterEmbed } from 'embeds/twitter';
import { EmbedBase } from 'embeds/embedBase';
import { Plugin } from 'obsidian';
import { YouTubeEmbed } from 'embeds/youtube';
import { SteamEmbed } from 'embeds/steam';
import { RedditEmbed } from 'embeds/reddit';
import { AutoEmbedSettingTab, DEFAULT_SETTINGS, PluginSettings } from 'settings-tab';
import { ImgurEmbed } from 'embeds/imgur';

// Remember to rename these classes and interfaces!

export default class AutoEmbedPlugin extends Plugin {
	settings: PluginSettings;
	embedSources: EmbedBase[] = [
		new TwitterEmbed(this),
		new RedditEmbed(this),
		new YouTubeEmbed(this),
		new SteamEmbed(this),
		new CodepenEmbed(this),
		new ImgurEmbed(this),
	]

	async onload() {
		console.log('loading plugin');
		await this.loadSettings();

		this.addSettingTab(new AutoEmbedSettingTab(this.app, this));
		
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

	private handleAnchor(a: HTMLAnchorElement) { 
		const innerText = a.innerText;
		// Removes all spaces
		const innerTextTrim = innerText.replace(/\s/g, "");
		
		if (innerTextTrim.includes("|noembed")) {
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
		this.insertEmbed(a, embed);
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
