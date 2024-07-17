export const regexUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

export function isURL(str: string) : boolean {
    // Returns false if it's an Obsidian internal link. 
    if (str.startsWith("app://")) {
        return false;
    }

    try {
        new URL(str);
        return true;
    } catch {
        return false;
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