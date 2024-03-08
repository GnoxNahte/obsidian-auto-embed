import AutoEmbedPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface PluginSettings {
	// General
	mySetting: string;
	darkMode: boolean;
	
	// Twitter
	
	// Reddit
	redditAutoSize: boolean; // Has some problems resizing when there are multiple reddit embeds
	
	// YouTube

	// Steam

	// Codepen

}

export const DEFAULT_SETTINGS: PluginSettings = {
	mySetting: 'default',
	darkMode: true,

	redditAutoSize: true,
}

export class AutoEmbedSettingTab extends PluginSettingTab {
	plugin: AutoEmbedPlugin;

	constructor(app: App, plugin: AutoEmbedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

        new Setting(containerEl)
            .setName("Dark Mode")
            .setDesc("Sets theme for embeds if the website allows")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.darkMode)
                .onChange(async (value) => {
                    this.plugin.settings.darkMode = value;
                    await this.plugin.saveSettings();
                }))

        new Setting(containerEl)
            .setName("Reddit Auto Size")
            .setDesc("There's a bug where it incorreclty assigns the wrong height if there's multiple reddit embeds. This toggles if it should auto resize or set a fixed size instead.")
            .setTooltip("If anyone know how to fix it, please help. \nSee GitHub for the source code.")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.darkMode)
                .onChange(async (value) => {
                    this.plugin.settings.darkMode = value;
                    await this.plugin.saveSettings();
                }))

        // TODO: Place this properly
        new Setting(containerEl)
            .setName("Spotify")
            .setDesc("Spotify only allows you to play 30 seconds of a song")
            .setTooltip("It only allows when the user is logged in the browser, which means it doesn't work in Obsidian");
	}
    
    // TODO: Reload markdown after closing settings
    // hide() {
        // console.log("Hiding settings");
        // this.plugin.app.workspace.updateOptions();
    // }
}