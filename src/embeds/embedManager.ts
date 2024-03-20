import AutoEmbedPlugin from "src/main";
import { EmbedBase } from "./embedBase";
import { TwitterEmbed } from "./twitter";
import { RedditEmbed } from "./reddit";
import { YouTubeEmbed } from "./youtube";
import { SteamEmbed } from "./steam";
import { CodepenEmbed } from "./codepen";
import { SpotifyEmbed } from "./spotify";
import { ImgurEmbed } from "./imgur";
import { DefaultFallbackEmbed } from "./defaultFallbackEmbed";

export class EmbedManager {
    // Singleton
    // Not sure how to share plugin class with the embed state field without singleton
    private static _instance: EmbedManager;

    private constructor() { }

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    plugin: AutoEmbedPlugin;
    embedSources: EmbedBase[];
    ignoredDomains: RegExp[];
    defaultFallbackEmbed: DefaultFallbackEmbed;

    init(plugin: AutoEmbedPlugin) {
        this.plugin = plugin;
        this.embedSources = [
            // Having some trouble replacing the embedded web pages from Obsidian. 
            // So remove YouTube and Twitter (Keep "TwitterEmbed" for x.com though, since Obsidian doesn't embed those)
            // new YouTubeEmbed(plugin),
            new TwitterEmbed(plugin),
            new RedditEmbed(plugin),
            new SteamEmbed(plugin),
            new CodepenEmbed(plugin),
            new SpotifyEmbed(plugin),
            new ImgurEmbed(plugin),
        ];

        this.ignoredDomains = [
            // Ignore embeds for youtube and twtiter
            new RegExp(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/)/),
            new RegExp(/https:\/\/(?:twitter)\.com/),
        ];

        this.defaultFallbackEmbed = new DefaultFallbackEmbed(plugin);
    }

    // Gets the embed source for the url
    // Returns null if it can't / shouldn't be embedded.
    static getEmbedSource(url: string, alt: string): EmbedBase | null{
		const noEmbedRegex = /noembed/i;
		if (noEmbedRegex.test(alt)) {
			return null;
		}

        const domain = this._instance.ignoredDomains.find(domain => {
            return domain.test(url);
        });

        if (domain) {
            return null;
        }

        const embedSource = this._instance.embedSources.find((source) => {
            return source.regex.test(url);
        });

        return embedSource ?? this._instance.defaultFallbackEmbed;
    }
}