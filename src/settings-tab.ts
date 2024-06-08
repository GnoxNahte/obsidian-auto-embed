import AutoEmbedPlugin from "src/main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { PreviewEmbedModal } from "src/preview-embed-modal";

export enum FallbackOptions {
    ShowErrorMessage, // Default
    EmbedLink,
    Hide,
}

export enum GoogleDocsViewOptions {
    Preview,
    EditMinimal,
    EditDefault,
}

export interface PluginSettings {
	// General
	darkMode: boolean;
	
	// Reddit
	redditAutoSize: boolean; // Has some problems resizing when there are multiple reddit embeds
	
    // Google Docs
    googleDocsViewOption: GoogleDocsViewOptions;

    // Fallback - Shows this when the link isn't supported
    fallbackOptions: FallbackOptions;
    fallbackWidth: string;
    fallbackHeight: string;

    // Advanced settings
    showAdvancedSettings: boolean;
    debug: boolean; // Shows debug text in console
}

export const DEFAULT_SETTINGS: PluginSettings = {
	darkMode: true,

	redditAutoSize: true,

    googleDocsViewOption: GoogleDocsViewOptions.Preview,

    fallbackOptions: FallbackOptions.ShowErrorMessage,
    fallbackWidth: "100%",
    fallbackHeight: "",

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

        // Takes in a enum and converts it to a record with the key and value
        function EnumToRecord<T extends {[key: number]: string | number}>(e: T): Record<string, string>  {
            const recordOutput: Record<string, string> = {};
            for (const option in e) {
                // Don't add if its a key (number)
                if (!isNaN(Number(option)))
                    continue;
                
                const displayText = option.replace(/([a-z0-9])([A-Z])/g, (match: string, p1: string, p2: string) => `${p1} ${p2.toLowerCase()}`);
                recordOutput[option] = displayText;
            }

            return recordOutput;
        }

        const previewTooltip = "Opens a modal (small window) to test with links with your settings";
        new Setting(containerEl)
            .setName("Preview Embed")
            .setTooltip(previewTooltip)
            .addButton(btn => btn
                .setButtonText("Preview")
                .setTooltip(previewTooltip)
                .onClick(() => {
                    const modal = new PreviewEmbedModal(plugin, "https://x.com/obsdmd/status/1739667211462316449");
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

        new Setting(containerEl)
            .setName("Google Docs")
            .setHeading()
            .setDesc("Note that when the view options is editable, the default page width is too small. Try to use \"Preview\" where possible");

        const googleDocsViewOptionDesc = new DocumentFragment();
        googleDocsViewOptionDesc.appendText("Preview - Uneditable, only embed the content");
        googleDocsViewOptionDesc.appendChild(createEl("br"))
        googleDocsViewOptionDesc.appendText("Edit minimal - Editable but don't show the header and toolbar");
        googleDocsViewOptionDesc.appendChild(createEl("br"))
        googleDocsViewOptionDesc.appendText("Edit default - Editable and shows the header and toolbar");

        new Setting(containerEl)
            .setName("Google Docs view options")
            .setDesc(googleDocsViewOptionDesc)
            .addDropdown(dropdown => dropdown
                .addOptions(EnumToRecord(GoogleDocsViewOptions))
                .setValue(GoogleDocsViewOptions[settings.googleDocsViewOption])
                .onChange(async (value) => {
                    settings.googleDocsViewOption = GoogleDocsViewOptions[value as keyof typeof GoogleDocsViewOptions];
                    await this.plugin.saveSettings();
                }))
        
        new Setting(containerEl)
            .setName("Fallback link")
            .setHeading()
            // TODO: Change description, showing the current option description
            // TODO: Add warning / error message when choosing Hide. Not recommended as only can see the link in source mode
            .setDesc("Choose what the plugin does when the link isn't supported");

        new Setting(containerEl)
            .setName("Fallback options")
            .addDropdown(dropdown => dropdown
                .addOptions(EnumToRecord(FallbackOptions))
                .setValue(FallbackOptions[settings.fallbackOptions])
                .onChange(async (value) => {
                    settings.fallbackOptions = FallbackOptions[value as keyof typeof FallbackOptions];
                    await this.plugin.saveSettings();
                }))

        new Setting(containerEl)
            .setName("Default width")
            .setDesc("Default is 100%, filling the width of the viewport")
            .addText(text => text
                .setValue(settings.fallbackWidth)
                .setPlaceholder("100%")
                .onChange(async (value) => {
                    settings.fallbackWidth = value;
                    await this.plugin.saveSettings();
                })
            )

        new Setting(containerEl)
            .setName("Default height")
            .addText(text => text
                .setValue(settings.fallbackHeight)
                .setPlaceholder("500px")
                .onChange(async (value) => {
                    settings.fallbackHeight = value;
                    await this.plugin.saveSettings();
                })
            )

        const additionalInfo = new DocumentFragment();
        additionalInfo.appendText("All values and units use ");
        additionalInfo.appendChild(createEl("a", {text: "CSS Units", href: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#numbers_lengths_and_percentages"}))
        additionalInfo.appendChild(createEl("br"))
        additionalInfo.appendText("Reload any opened note to apply changes");

        new Setting(containerEl)
            .setDesc(additionalInfo)
	}
    
    // TODO: Reload markdown after closing settings
    // hide() {
        // console.log("Hiding settings");
        // this.plugin.app.workspace.updateOptions();
    // }
}