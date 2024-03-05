import { CodepenEmbed } from 'embeds/codepen';
import { EmbedBase } from 'embeds/embedBase';
import { Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!

export interface PluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: PluginSettings;
	embedSources: EmbedBase[] = [
		new CodepenEmbed(),
	]

	async onload() {
		console.log('loading plugin!!')
		await this.loadSettings();
		
		this.registerMarkdownPostProcessor((el, ctx) => {
			console.log("Registering markdown")
			const anchors = el.querySelectorAll('a.external-link') as NodeListOf<HTMLAnchorElement>;
			anchors.forEach((anchor) => {
				console.log("Testing: " + anchor.text);
				this.handleAnchor(anchor);
			})
		})
	}

	onunload() {
		console.log('unloading plugin')
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
		const container = createDiv({cls: "embed-container"});
		const embed = embedSource.createEmbed(link, container, this.settings);
		return embed;
		return container;
	}

	private insertEmbed(a: HTMLAnchorElement, container: HTMLElement) {
		const parent = a.parentElement;
		parent?.replaceChild(container, a);
	}
}
