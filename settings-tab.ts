import AutoEmbedPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { PreviewEmbedModal } from "preview-embed-modal";

export interface PluginSettings {
	// General
	darkMode: boolean;
	
	// Twitter
	
	// Reddit
	redditAutoSize: boolean; // Has some problems resizing when there are multiple reddit embeds
	
	// YouTube

	// Steam

	// Codepen

    // Advanced settings
    showAdvancedSettings: boolean;
    debug: boolean; // Shows debug text in console
}

export const DEFAULT_SETTINGS: PluginSettings = {
	darkMode: true,

	redditAutoSize: true,

    showAdvancedSettings: false,
    debug: false,
}

export class AutoEmbedSettingTab extends PluginSettingTab {
	plugin: AutoEmbedPlugin;

	constructor(app: App, plugin: AutoEmbedPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

        // To shorten the code
        const plugin = this.plugin;
        const settings = this.plugin.settings;

		containerEl.empty();

        const previewTooltip = "Opens a modal (small window) to test with links with your settings";
        new Setting(containerEl)
            .setName("Preview Embed")
            .setTooltip(previewTooltip)
            .addButton(btn => btn
                .setButtonText("Preview")
                .setTooltip(previewTooltip)
                .onClick(() => {
                    const modal = new PreviewEmbedModal(plugin, "https://www.youtube.com/watch?v=DbsAQSIKQXk&t=468s");
                    modal.open();
                }))

        new Setting(containerEl)
            .setName("Dark mode")
            .setDesc("If the website has an option for it, sets the default theme for embeds.")
            .addToggle(toggle => toggle
                .setValue(settings.darkMode)
                .onChange(async (value) => {
                    settings.darkMode = value;
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName("Reddit")
            .setHeading();

        new Setting(containerEl)
            .setName("Reddit auto size")
            .setDesc("There's a bug where it incorreclty assigns the wrong height if there's multiple reddit embeds. This toggles if it should auto resize or set a fixed size instead.")
            .setTooltip("If anyone know how to fix it, please help. \nSee GitHub for the source code.")
            .addToggle(toggle => toggle
                .setValue(settings.darkMode)
                .onChange(async (value) => {
                    settings.darkMode = value;
                    await this.plugin.saveSettings();
                })
            );
	}
    
    // TODO: Reload markdown after closing settings
    // hide() {
        // console.log("Hiding settings");
        // this.plugin.app.workspace.updateOptions();
    // }
}