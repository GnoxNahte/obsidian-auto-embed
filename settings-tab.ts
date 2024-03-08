import AutoEmbedPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface PluginSettings {
	// General
    embedByDefault: boolean;
	darkMode: boolean;
	
	// Twitter
	
	// Reddit
	redditAutoSize: boolean; // Has some problems resizing when there are multiple reddit embeds
	
	// YouTube

	// Steam

	// Codepen

}

export const DEFAULT_SETTINGS: PluginSettings = {
	darkMode: true,
    embedByDefault: false,

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

        // Do this to help updated the setting description after user changes the setting. 
        // TODO: Find a better way to do it?
        const embedByDefaultDesc = [
            "Embeds by default, put \"ae:noembed\" if don't want to embed. E.g. [Title ae:noembed](https:example.com)",
            "Embeds only its explicity stated by using \"ae:embed\" E.g. [ae:embed](https.example.com)"
        ];
        const embedByDefaultSetting = new Setting(containerEl) 
            .setName("Embed by default")
            .setDesc(embedByDefaultDesc[this.plugin.settings.embedByDefault ? 0 : 1])
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.embedByDefault)
                .onChange(async (value) => {
                    this.plugin.settings.embedByDefault = value;
                    embedByDefaultSetting.setDesc(embedByDefaultDesc[this.plugin.settings.embedByDefault ? 0 : 1]);
                    await this.plugin.saveSettings();
                }))

        new Setting(containerEl)
            .setName("Dark mode")
            .setDesc("Sets theme for embeds if the website allows")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.darkMode)
                .onChange(async (value) => {
                    this.plugin.settings.darkMode = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName("Reddit")
            .setHeading();

        new Setting(containerEl)
            .setName("Reddit auto size")
            .setDesc("There's a bug where it incorreclty assigns the wrong height if there's multiple reddit embeds. This toggles if it should auto resize or set a fixed size instead.")
            .setTooltip("If anyone know how to fix it, please help. \nSee GitHub for the source code.")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.darkMode)
                .onChange(async (value) => {
                    this.plugin.settings.darkMode = value;
                    await this.plugin.saveSettings();
                }));

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