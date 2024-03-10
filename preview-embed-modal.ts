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

        let linkText = this.plugin.getLinkText(this.url, this.options);

        const sourceMode = createEl("p", { text: `[${linkText}](${this.url})` });
        const livePreview = createEl("a", { text: linkText, href: this.url });
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
                    linkText = this.plugin.getLinkText(this.url, this.options);

                    sourceMode.setText(`[${linkText}](${this.url})`);

                    livePreview.setText(linkText)
                    livePreview.href = this.url;

                    if (currEmbed)
                        contentEl.removeChild(currEmbed);
                    
                    const readingViewAnchor = createEl("a", { text: linkText, href: this.url });
                    contentEl.appendChild(readingViewAnchor);
                    this.plugin.handleAnchor(readingViewAnchor);
                }));

        new Setting(contentEl)
            .setName("Preview option")
            .addText(text => text
                .setValue(this.options))

        contentEl.appendChild(createEl("h3", { text: "Source Mode:" }));
        contentEl.appendChild(sourceMode);
        
        contentEl.appendChild(createEl("h3", { text: "Live Preview:" }));
        contentEl.appendChild(livePreview);
        
        contentEl.appendChild(createEl("h3", { text: "Reading View:" }));
        const readingViewAnchor = createEl("a", { text: linkText, href: this.url });
        contentEl.appendChild(readingViewAnchor);
        currEmbed = this.plugin.handleAnchor(readingViewAnchor);
    }
}