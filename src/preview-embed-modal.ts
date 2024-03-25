import AutoEmbedPlugin from "src/main";
import { Modal, Setting } from "obsidian";

export class PreviewEmbedModal extends Modal {
    plugin: AutoEmbedPlugin;
    url: string;
    options: string;

    constructor(plugin: AutoEmbedPlugin, url: string, options?: string) {
        super(plugin.app);
        this.plugin = plugin;
        this.url = url;
        this.options = options ?? "";
    }

    createEmbed (contentEl: HTMLElement) {
        console.log("A")
        // Imitate when it's in Reading Mode, replacing the img tag with the embed
        const readingViewImg = createEl("img");
        readingViewImg.src = this.url;
        readingViewImg.alt = this.options;
        contentEl.appendChild(readingViewImg);
        return this.plugin.handleImage(readingViewImg);
    }

    onOpen(): void {
        const {contentEl} = this;
        this.titleEl.textContent = "Preview Embed";

        // let linkText = this.plugin.getLinkText(this.url, this.options);

        let currEmbed: HTMLElement | null = null;

        // ===== NOTE =====
        // Setting is probably not meant to be used like this.
        // But to make the user experience consistent, Use Setting inside this modal
        // Think Setting just helps create and insert the html into contentEl? Hopefully not doing anything else. Couldn't find any documentation about it.

        new Setting(contentEl)
            .setName("Preview url")
            .addText(text => text
                .setValue(this.url)
                .onChange((value) => {
                    this.url = value;

                    if (currEmbed)
                        contentEl.removeChild(currEmbed);
                    
                    currEmbed = this.createEmbed(contentEl);
                }));

        new Setting(contentEl)
            .setName("Preview option")
            .addText(text => text
                .setValue(this.options)
                .onChange((value) => {
                    this.options = value;

                    if (currEmbed)
                        contentEl.removeChild(currEmbed);

                    currEmbed = this.createEmbed(contentEl);
                }))

        // TODO: add invalid url

        contentEl.appendChild(createEl("h3", { text: "Embed" }));
        
        currEmbed = this.createEmbed(contentEl);
    }
}