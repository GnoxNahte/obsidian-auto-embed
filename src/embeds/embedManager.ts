import AutoEmbedPlugin from "src/main";
import { BaseEmbedData, EmbedBase } from "./embedBase";
import { TwitterEmbed } from "./twitter";
import { RedditEmbed } from "./reddit";
import { SteamEmbed } from "./steam";
import { CodepenEmbed } from "./codepen";
import { SpotifyEmbed } from "./spotify";
import { ImgurEmbed } from "./imgur";
import { DefaultFallbackEmbed } from "./defaultFallbackEmbed";
import { GoogleDocsEmbed } from "./googleDocs";
import { TikTokEmbed } from "./tiktok";
import { SoundCloudEmbed } from "./soundcloud";
import { SupportedWebsites } from "src/settings-tab";
import { apiVersion } from "obsidian";
import { InstagramEmbed } from "./instagram";
// import { YouTubeEmbed } from "./youtube";

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
        // Add any new embeds here
        this.embedSources = [
            // new YouTubeEmbed(plugin),
            new RedditEmbed(plugin),
            new SteamEmbed(plugin),
            new CodepenEmbed(plugin),
            new SpotifyEmbed(plugin),
            new ImgurEmbed(plugin),
            new GoogleDocsEmbed(plugin),
            new TikTokEmbed(plugin),
            new SoundCloudEmbed(plugin),
            new InstagramEmbed(plugin),
        ];

        // Having some trouble replacing the embedded web pages from Obsidian. 
        // So remove YouTube and Twitter (Keep "TwitterEmbed" for x.com though, since Obsidian doesn't embed those)
        this.ignoredDomains = [
            // Ignore embeds for youtube and twtiter
            new RegExp(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/)/)
        ];


        // Obsidian starts supporting x.com embeds from version 1.7.0 onwards. 
        // So, check which version the user is currently on, then 
        // If user is on 1.7.0 and up, 
        //      Don't embed Twitter & X
        // Else
        //      Don't embed Twitter only
        const apiVersionSplit = apiVersion.split(".");
        const majorVersion = parseInt(apiVersionSplit[0]);
        const minorVersion = parseInt(apiVersionSplit[1]);

        if (majorVersion > 1 || 
            (majorVersion === 1 && minorVersion >= 7)) {
                // Ignore twitter & X
                this.ignoredDomains.push(new RegExp(/https:\/\/(?:twitter|x)\.com/))
            }
        else {
            this.embedSources.push(new TwitterEmbed(plugin));
            // Ignore twitter only
            this.ignoredDomains.push(new RegExp(/https:\/\/(?:twitter)\.com/));
        }

        this.defaultFallbackEmbed = new DefaultFallbackEmbed(plugin);
    }

    // Gets the embed source for the url
    // Returns null if it can't / shouldn't be embedded.
    static getEmbedData(url: string, alt: string): BaseEmbedData | null{
        const domain = this._instance.ignoredDomains.find(domain => {
            return domain.test(url);
        });
        // If found a domain in the ignored domains, return
        if (domain) {
            return null;
        }

        const embedSource = this._instance.embedSources.find((source) => {
            return source.regex.test(url);
        }) ?? this._instance.defaultFallbackEmbed;

        // TODO: Consider moving this up. If it's at the start, need to get the top level domain then filter the websites. 
        //       Skips any regex and other checks too
        const isWebsiteEnabled = !this._instance.plugin.settings.enabledWebsites[embedSource.name as SupportedWebsites];
        if (embedSource !== this._instance.defaultFallbackEmbed && isWebsiteEnabled) {
            return null;
        }

        const options = embedSource.getOptions(alt);

        if (!options.shouldEmbed)
            return null;

        return options;
    }
}