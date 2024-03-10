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
    
    // Content inside <a> tags. 
    // Example:
    //      linkText = "embed:{{url}}|{{options}}"
    //      output = "embed:example.com|dark-mode,w=100%,h=300px"
    markdownLinkTextFormat: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	darkMode: true,

	redditAutoSize: true,

    showAdvancedSettings: false,
    debug: false,
    markdownLinkTextFormat: "embed:{{url}}|{{options}}",
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
                    const modal = new PreviewEmbedModal(plugin, url);
                    modal.open();
                }))
        
        // For previewing embed
        let url = "https://www.youtube.com/watch?v=DbsAQSIKQXk&t=468s";
        let options = "dark-mode";

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

        // ===== Advanced Settings =====
            
        // Add all advanced settings here. Excluding "Show advanced settings"
        const advancedSettings: Setting[] = [];
        // Toggles display value for all advanced settings at the start and when toggled
        function updateAdvancedSettingsDisplay() {
            const displayValue = settings.showAdvancedSettings ? "" : "none";
            advancedSettings.forEach(setting => {
                setting.settingEl.style.display = displayValue;
            });
        }

        new Setting(containerEl)
            .setName("Show advanced settings")
            .setHeading()
            .addToggle(toggle => toggle
                .setValue(settings.showAdvancedSettings)
                .onChange(async (value) => {
                    settings.showAdvancedSettings = value;

                    updateAdvancedSettingsDisplay();

                    await plugin.saveSettings();
                }))

        // ===== Showing link text preview =====
        // #region 

        // Shorten standardised way of creating the text pop, 
        // Referenced from how Obsidian does it from Settings -> Daily notes -> Date format
        function createTextPopEl(text: string): HTMLElement { return createEl("b", {cls: "u-pop #text-pop", text: text})}

        const linkTextSample = new DocumentFragment();
        // linkTextSample.textContent = "Markdown: ";
        const linkTextSampleText = createTextPopEl(this.plugin.getLinkText(url));
        linkTextSample.appendChild(linkTextSampleText);
        
        const linkTextOptionsSample = new DocumentFragment();
        // linkTextOptionsSample.textContent = "Markdown: ";
        const linkTextOptionsSampleText = createTextPopEl(this.plugin.getLinkText(url, options));
        linkTextOptionsSample.appendChild(linkTextOptionsSampleText);
        
        // Updates the preview texts
        // Use this syntax because using the normal syntax: function updatePreviews(), has a different 'this' and won't work.
        const updatePreviews = () => {
            linkTextSampleText.textContent = this.plugin.getLinkText(url);
            linkTextOptionsSampleText.textContent = this.plugin.getLinkText(url, options);
        }

        const linkTextDesc = new DocumentFragment();
        linkTextDesc.appendChild(document.createTextNode("Sets text inside markdown links to be embedded. Choose a unique marker to avoid triggering it accidentally. Only showed when in Live Preview or Source Mode"));
        linkTextDesc.appendChild(createEl("br"))
        linkTextDesc.appendChild(document.createTextNode("Available variables: {{url}}, {{options}}, e.g. \"embed:{{url}}, {{options}}\""));
        linkTextDesc.appendChild(createEl("br"))
        linkTextDesc.appendChild(createEl("a", {text: "More Info", href: "https://github.com/GnoxNahte/obsidian-auto-embed/edit/main/README.md#setting-the-format-for-the-content-in-markdown-link"}))
        
        advancedSettings.push(new Setting(containerEl)
            .setName("Markdown link format")
            .setDesc(linkTextDesc)
            .addText(text => text
                .setValue(settings.markdownLinkTextFormat)
                .onChange(async (value) => {
                    settings.markdownLinkTextFormat = value;
                    updatePreviews();

                    await this.plugin.saveSettings();
                })
            )
        );
        
        advancedSettings.push(new Setting(containerEl)
            .setName("Preview url")
            .addText(text => text
                .setValue(url)
                .onChange((value) => {
                    url = value;
                    updatePreviews();
                })
            )
        );

        const previewOption = new DocumentFragment();
        previewOption.textContent = "Overrides other settings. For example, if \"Dark mode\" is disabled, the \"dark-mode\" option will override it. For the ";
        previewOption.appendChild(createEl("a", {text:"full list of options", href:"https://github.com/GnoxNahte/obsidian-auto-embed/edit/main/README.md#set-custom-options"}));

        advancedSettings.push(new Setting(containerEl)
            .setName("Preview options")
            .setDesc(previewOption)
            .addText(text => text
                .setValue(options)
                .onChange(async (value) => {
                    options = value;
                    updatePreviews();
                })
            )
        );
        
        advancedSettings.push(new Setting(containerEl)
            .setName("Preview markdown link text")
            .setDesc(linkTextSample)
            .addButton(btn => btn
                .setButtonText("Preview embed")
                .onClick(() => {
                    const modal = new PreviewEmbedModal(plugin, url);
                    modal.open();
                })
            )
        );

        advancedSettings.push(new Setting(containerEl)
            .setName("Preview markdown link text with options")
            .setDesc(linkTextOptionsSample)
            .addButton(btn => btn
                .setButtonText("Preview embed")
                .onClick(() => {
                    const modal = new PreviewEmbedModal(plugin, url, options);
                    modal.open();
                })
            )
        );
        
        // #endregion

        updateAdvancedSettingsDisplay();
	}
    
    // TODO: Reload markdown after closing settings
    // hide() {
        // console.log("Hiding settings");
        // this.plugin.app.workspace.updateOptions();
    // }
}