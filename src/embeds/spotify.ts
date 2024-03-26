import { EmbedBase } from "./embedBase";

export class SpotifyEmbed extends EmbedBase {
    name = "Spotify";
    regex = new RegExp(/https:\/\/(?:open|play|www)\.spotify\.com\/(\w+)\/(\w+)(?:\?highlight=spotify:track:(\w+))?/);

    createEmbed(url: string): HTMLElement {
        const regexMatch = url.match(this.regex);
        // Shouldn't happen since got test before. But in case
        if (regexMatch === null)
            return this.onErrorCreatingEmbed();

        // Not sure why there's empty space below inside the iframe. Use this to remove the space.
        const iframeContainer = createDiv();
        iframeContainer.classList.add(this.autoEmbedCssClass, "spotify-embed-container");
        //  TODO: Set 'playlist' as default, only specify 'track' (individual song) 
        if (regexMatch[1] === "playlist" || regexMatch[1] === "album" || regexMatch[1] === "artist")
            iframeContainer.classList.add("spotify-playlist-embed");

        // Creating the iframe
        const iframe = createEl("iframe", {parent: iframeContainer});
        
        // TODO (Bug?): Highlighting not working properly, not sure if spotify supports it when using embeds
        // Removing /embed/ and pasting the url in browser correctly highlights the song though
        iframe.src = `https://open.spotify.com/embed/${regexMatch[1]}/${regexMatch[2]}?utm_source=oembed` +
                     (regexMatch[3] !== undefined ? ("&highlight=spotify:track:" + regexMatch[3]) : "");

        iframe.classList.add(this.autoEmbedCssClass, "spotify-embed");
        iframe.setAttribute("allowfullscreen", "");
        // iframe.setAttribute("allow", "clipboard-write; encrypted-media; fullscreen; picture-in-picture;");
        iframe.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture");
        // iframe.setAttribute("sandbox", "allow-forms allow-presentation allow-same-origin allow-scripts allow-modals");
        return iframeContainer;
    }
} 