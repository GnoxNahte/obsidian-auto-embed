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
    ignoredDomains: string[];
    defaultFallbackEmbed: DefaultFallbackEmbed;
    hostNameDictionary: Record<string, EmbedBase>;

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

        // Build the dictionary
        this.hostNameDictionary = { };
        this.embedSources.forEach((source) => {
            source.hostnames.forEach((hostName) => {
                this.hostNameDictionary[hostName] = source;
            });
        });

        // Having some trouble replacing the embedded web pages from Obsidian. 
        // So remove YouTube and Twitter (Keep "TwitterEmbed" for x.com though, since Obsidian doesn't embed those)
        this.ignoredDomains = [
            // Ignore embeds for youtube
            "youtube.com", 
            "m.youtube.com", 
            "youtu.be", 
            "youtube-nocookie.com",

            // Ignore embeds for twitter.com
            // In the next step, check the Obsidian version and decide if ignore x.com too
            ""
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
            this.ignoredDomains.push("x.com");
        }
        else {
            this.embedSources.push(new TwitterEmbed(plugin));
        }

        this.defaultFallbackEmbed = new DefaultFallbackEmbed(plugin);
    }

    // Gets the embed source for the url
    // Returns null if it can't / shouldn't be embedded.
    static getEmbedData(hostname: string, url: string, alt: string): BaseEmbedData | null{
        performance.mark("get-embed-start");
        // If found a domain in the ignored domains, return
        if (this._instance.ignoredDomains.contains(hostname))
            return null;

        let embedSource: EmbedBase | null = null;

        // First try of finding embedSource
        embedSource = this._instance.hostNameDictionary[hostname];

        // Second try of finding embedSource,
        // Reduce the subdomains one level at a time.
        if (!embedSource) {
            const domainParts = hostname.split(".")
            for (let i = 1; i < domainParts.length - 1; i++) {
                const domain = domainParts.slice(i).join('.');
                const source = this._instance.hostNameDictionary[domain];
                if (source) {
                    embedSource = source;
                    break;
                }
            }
        }

        if (!embedSource || !embedSource.regex.test(url))
            embedSource = this._instance.defaultFallbackEmbed;

        // TODO: Consider moving this up. If it's at the start, need to get the top level domain then filter the websites. 
        //       Skips any regex and other checks too
        const isWebsiteEnabled = !this._instance.plugin.settings.enabledWebsites[embedSource.name as SupportedWebsites];
        if (embedSource !== this._instance.defaultFallbackEmbed && isWebsiteEnabled) {
            return null;
        }
        performance.mark("get-embed-end");

        const measure = performance.measure("get-embed-measure", "get-embed-start", "get-embed-end");
        console.log(embedSource.name + " : " + measure.duration);
        performance.clearMarks();
        performance.clearMeasures();
        performance.clearResourceTimings();

        const options = embedSource.getOptions(alt);

        if (!options.shouldEmbed)
            return null;

        return options;
    }
}