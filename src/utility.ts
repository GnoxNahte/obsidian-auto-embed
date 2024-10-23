export const regexUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

export function getUrlHostname(str: string) : string | null {
    // Returns false if it's an Obsidian internal link. 
    if (str.startsWith("app://")) {
        return null;
    }

    try {
        // Get the hostname and remove "www." if it exists
        // Note, no need check for "https://" as this is already the hostname
        return new URL(str).hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
}

export function isLinkToImage(url: string) : boolean {
    return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);
}

export interface Dictionary<T> {
    [key: string]: T;
}

export interface Size {
    width: number;
    height: number;
}