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

export enum PreloadOptions {
    None,
    Placeholder,
    Placeholder_ClickToLoad,
    // Thumbnail,
    // Thumbnail_ClickToLoad,
}

// export type SupportedWebsites = "CodePen" | "Google Docs" | "Imgur" | "Reddit" | "SoundCloud" | "Spotify" | "Steam" | "TikTok" | "Twitter/X" | "YouTube";

const supportedWebsites = [ "Twitter/X", "Imgur", "Reddit", "CodePen", "Google Docs", "SoundCloud", "Spotify", "Steam", "TikTok", "Instagram" ] as const;
export type SupportedWebsites = (typeof supportedWebsites)[number];
export type SupportedWebsitesMap = {
    [key in SupportedWebsites]: boolean
};

export interface PluginSettings {
	// General
	darkMode: boolean;
    preloadOption: PreloadOptions;
    suggestEmbed: boolean;

    enabledWebsites: SupportedWebsitesMap;
	
    // Google Docs
    googleDocsViewOption: GoogleDocsViewOptions;

    // Fallback - Shows this when the link isn't supported
    fallbackOptions: FallbackOptions;
    fallbackWidth: string;
    fallbackHeight: string;
    fallbackDefaultLink: string;
    fallbackAutoTitle: boolean;

    // Advanced settings
    showAdvancedSettings: boolean;
    debug: boolean; // Shows debug text in console
}

export const DEFAULT_SETTINGS: PluginSettings = {
	darkMode: true,
    preloadOption: PreloadOptions.Placeholder,
    suggestEmbed: true,

    enabledWebsites: ResetEnabledWebsites(),
    // enabledWebsites: new Map(Object.values(SupportedWebsites).map(website => [
    //     website, 
    //     // Set excluded websites to false (by default), set other websites to true.
    //     (website !== SupportedWebsites.YouTube && website !== SupportedWebsites.Twitter),
    // ])),

    googleDocsViewOption: GoogleDocsViewOptions.Preview,

    fallbackOptions: FallbackOptions.EmbedLink,
    fallbackWidth: "100%",
    fallbackHeight: "500px",
    fallbackDefaultLink: "Link",
    fallbackAutoTitle: true,

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
        
        // Validate the user's current setting. 
        function ValidateSettings(setting: PluginSettings, plugin: AutoEmbedPlugin) {
            // console.log(JSON.stringify(setting.enabledWebsites));
            if (setting.enabledWebsites && Object.keys(setting.enabledWebsites).length > 0) {
                // Add any missing websites. Might happen if plugin updates with a new website
                const newWebsites = supportedWebsites.filter(website => setting.enabledWebsites[website] === undefined);
                
                if (newWebsites.length > 0) {
                    // console.log(`Adding ${newWebsites.length} websites to 'enabled website' list: ${newWebsites.toString()}`);
                    newWebsites.forEach(website => setting.enabledWebsites[website] = true);
                    
                    plugin.saveSettings();
                }
            }
            // If there is no websites at all
            // Shouldn't happen since Obsidian automatically populates it using DEFAULT_SETTINGS but just in case.
            else {
                console.log("No enabled websites setting found. Adding all")
                setting.enabledWebsites = ResetEnabledWebsites();
                plugin.saveSettings();
            }
        }

        ValidateSettings(settings, plugin);

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

        // Not perfect but just a tmp solution for adding bottom border and indenting the setting.
        // Maybe create a new function just for adding a bottom border for the last element 
        function AddPadding(setting: Setting, addBottomBorder = false) {
            setting.settingEl.style.paddingLeft = "2em";
            setting.settingEl.style.borderLeft = "1px solid var(--background-modifier-border)";
            if (addBottomBorder)
                setting.settingEl.style.borderBottom = "1px solid var(--background-modifier-border)";
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
        
        const preloadOptions = EnumToRecord(PreloadOptions);
        Object.entries(preloadOptions).forEach(([key, value]) => {
            preloadOptions[key] = value.replace("_", " + "); 
        });

        new Setting(containerEl)
            .setName("Preload options")
            .setDesc("Choose how the embed behaves before loading.")
            .addDropdown(dropdown => dropdown
                .addOptions(preloadOptions)
                .setValue(PreloadOptions[settings.preloadOption])
                .onChange(async (value) => {
                    settings.preloadOption = PreloadOptions[value as keyof typeof PreloadOptions];
                    await this.plugin.saveSettings();
                })
            );
            
        new Setting(containerEl)
            .setName("Suggest embed")
            .setDesc("If you are pasting a link, suggest to embed it.")
            .addToggle(toggle => toggle
                .setValue(settings.suggestEmbed)
                .onChange(async (value) => {
                    settings.suggestEmbed = value;
                    if (settings.suggestEmbed)
                        plugin.registerSuggest();
                    await this.plugin.saveSettings();
                })
            );

        new Setting(containerEl)
            .setName("Supported website")
            .setHeading()
            .setDesc("YouTube & Twitter/X is supported by Obsidian natively so it's off by default.");

        for (const website in settings.enabledWebsites) {
            const websiteSetting = new Setting(containerEl)
                .setName(website)
                .addToggle(toggle => toggle 
                    .setValue(settings.enabledWebsites[website as SupportedWebsites])
                    .onChange(async (value) => {
                        settings.enabledWebsites[website as SupportedWebsites] = value;
                        await this.plugin.saveSettings();
                    })
                );
            
            AddPadding(websiteSetting, true);
        }
        
        new Setting(containerEl)
            .setName("Google Docs")
            .setHeading()
            .setDesc("Note that when the view options is set to editable, the default page width is too small. Try to use \"Preview\" where possible");
        const googleDocsViewOptionDesc = new DocumentFragment();
        googleDocsViewOptionDesc.appendText("Preview - Uneditable, only embed the content");
        googleDocsViewOptionDesc.appendChild(createEl("br"))
        googleDocsViewOptionDesc.appendText("Edit minimal - Editable but don't show the header and toolbar");
        googleDocsViewOptionDesc.appendChild(createEl("br"))
        googleDocsViewOptionDesc.appendText("Edit default - Editable and shows the header and toolbar");
        
        const googleDocsOption = new Setting(containerEl)
            .setName("Google Docs view options")
            .setDesc(googleDocsViewOptionDesc)
            .addDropdown(dropdown => dropdown
                .addOptions(EnumToRecord(GoogleDocsViewOptions))
                .setValue(GoogleDocsViewOptions[settings.googleDocsViewOption])
                .onChange(async (value) => {
                    settings.googleDocsViewOption = GoogleDocsViewOptions[value as keyof typeof GoogleDocsViewOptions];
                    await this.plugin.saveSettings();
                }))
        AddPadding(googleDocsOption, true);
        
        new Setting(containerEl)
            .setName("Fallback link")
            .setHeading()
            // TODO: Change description, showing the current option description
            // TODO: Add warning / error message when choosing Hide. Not recommended as only can see the link in source mode
            .setDesc("Choose what the plugin does when the link isn't supported");
        
        const fallbackSettings: Setting[] = [];
        const fallbackEmbedSettings: Setting[] = [];

        function UpdateFallbackEmbedVisibility() {
            fallbackEmbedSettings.forEach(setting => {
                setting.settingEl.style.display = settings.fallbackOptions === FallbackOptions.EmbedLink ? "flex" : "none";
            })
        }

        fallbackSettings.push(new Setting(containerEl)
            .setName("Fallback options")
            .addDropdown(dropdown => dropdown
                .addOptions(EnumToRecord(FallbackOptions))
                .setValue(FallbackOptions[settings.fallbackOptions])
                .onChange(async (value) => {
                    settings.fallbackOptions = FallbackOptions[value as keyof typeof FallbackOptions];
                    UpdateFallbackEmbedVisibility();
                    
                    await this.plugin.saveSettings();
                })))

        fallbackSettings.push(new Setting(containerEl)
            .setName("Default width")
            .setDesc("Default is 100%, filling the width of the viewport")
            .addText(text => text
                .setValue(settings.fallbackWidth)
                .setPlaceholder("100%")
                .onChange(async (value) => {
                    settings.fallbackWidth = value;
                    await this.plugin.saveSettings();
                })
            ))

        fallbackSettings.push(new Setting(containerEl)
            .setName("Default height")
            .setDesc("Default is 500px. Set to 100vh if u want it to be the height of the viewport")
            .addText(text => text
                .setValue(settings.fallbackHeight)
                .setPlaceholder("500px")
                .onChange(async (value) => {
                    settings.fallbackHeight = value;
                    await this.plugin.saveSettings();
                })
            ))

        fallbackEmbedSettings.push(new Setting(containerEl)
            .setName("Auto link title")
            .setDesc("Automatically fetches and displays the title below the embed when a custom title isn’t set")
            .addToggle(toggle => toggle
                .setValue(settings.fallbackAutoTitle)
                .onChange(async (value) => {
                    settings.fallbackAutoTitle = value;
                    await this.plugin.saveSettings();
                })
            )
        )

        
        const defaultTitleDescription = new DocumentFragment();
        defaultTitleDescription.appendText("Default text when 'Auto link title' is false OR no title is found.");
        defaultTitleDescription.appendChild(createEl("br"))
        defaultTitleDescription.appendText("Set 'Auto link title' to false and clear 'Default title' to remove the link.");

        fallbackEmbedSettings.push(new Setting(containerEl)
            .setName("Default title")
            .setDesc(defaultTitleDescription)
            .addText(text => text
                .setValue(settings.fallbackDefaultLink)
                .setPlaceholder("Link")
                .onChange(async (value) => {
                    settings.fallbackDefaultLink = value;
                    await this.plugin.saveSettings();
                })
            )
        )

        UpdateFallbackEmbedVisibility();
            
        fallbackSettings.push(...fallbackEmbedSettings);
        fallbackSettings.forEach(setting => {
            AddPadding(setting);
        });

        const additionalInfo = new DocumentFragment();
        additionalInfo.appendText("All values and units use ");
        additionalInfo.appendChild(createEl("a", {text: "CSS Units", href: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#numbers_lengths_and_percentages"}))
        additionalInfo.appendChild(createEl("br"))
        additionalInfo.appendText("Reload any opened note to apply changes");
        
        additionalInfo.appendChild(createEl("br"))
        additionalInfo.appendChild(createEl("br"))
        
        additionalInfo.appendText("Found bugs, have a website to embed, or want a feature?");
        additionalInfo.appendChild(createEl("br"))
        additionalInfo.appendChild(createEl("a", {text: "Create a GitHub issue", href: "https://github.com/GnoxNahte/obsidian-auto-embed/issues/new"}))
        additionalInfo.appendText(" or ");
        additionalInfo.appendChild(createEl("a", {text: "submit a Google Form", href: "https://forms.gle/xtuv4FVCKZ2tg9zK9"}))

        new Setting(containerEl)
            .setDesc(additionalInfo)
	}
    
    // TODO: Reload markdown after closing settings
    // hide() {
        // console.log("Hiding settings");
        // this.plugin.app.workspace.updateOptions();
    // }
}

function ResetEnabledWebsites(): SupportedWebsitesMap {
    return Object.fromEntries(
        supportedWebsites.map((website) => [
            website, 
            // Exclude some websites by default. Set the rest to true
            // (website !== "Twitter/X"),
        ])
    ) as SupportedWebsitesMap
}