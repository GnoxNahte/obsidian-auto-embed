import AutoEmbedPlugin from "main";
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
                    
                    const readingViewAnchor = createEl("a", { text: "", href: this.url });
                    contentEl.appendChild(readingViewAnchor);
                    this.plugin.handleAnchor(readingViewAnchor);
                }));

        new Setting(contentEl)
            .setName("Preview option")
            .addText(text => text
                .setValue(this.options))

        // TODO: add invalid url

        contentEl.appendChild(createEl("h3", { text: "Reading View:" }));
        const readingViewAnchor = createEl("a", { text: "", href: this.url });
        contentEl.appendChild(readingViewAnchor);
        currEmbed = this.plugin.handleAnchor(readingViewAnchor);
    }
}