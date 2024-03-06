import { CodepenEmbed } from 'embeds/codepen';
import { TwitterEmbed } from 'embeds/twitter';
import { EmbedBase } from 'embeds/embedBase';
import { Plugin } from 'obsidian';
import { YouTubeEmbed } from 'embeds/youtube';
import { SteamEmbed } from 'embeds/steam';
import { RedditEmbed } from 'embeds/reddit';

// Remember to rename these classes and interfaces!

export interface PluginSettings {
	mySetting: string;
	darkMode: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	mySetting: 'default',
	darkMode: true,
}

export default class MyPlugin extends Plugin {
	settings: PluginSettings;
	embedSources: EmbedBase[] = [
		new TwitterEmbed(),
		new YouTubeEmbed(),
		new RedditEmbed(),
		new SteamEmbed(),
		new CodepenEmbed(),
	]

	async onload() {
		console.log('loading plugin');
		await this.loadSettings();

		this.embedSources.forEach(source => {
			source.onload?.();
		});
		
		this.registerMarkdownPostProcessor((el, ctx) => {
			console.log("Registering markdown")
			const anchors = el.querySelectorAll('a.external-link') as NodeListOf<HTMLAnchorElement>;
			anchors.forEach((anchor) => {
				this.handleAnchor(anchor);
			})
		})
	}

	onunload() {
		console.log('unloading plugin');
		
		this.embedSources.forEach(source => {
			source.onunload?.();
		});
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
		const embed = embedSource.createEmbed(link, this.settings);
		return embed;
	}

	private insertEmbed(a: HTMLAnchorElement, container: HTMLElement) {
		const parent = a.parentElement;
		parent?.replaceChild(container, a);
	}
}
