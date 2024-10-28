export const regexUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

export function isURL(str: string) : boolean {
    let url: URL;

    try {
        url = new URL(str);
    } catch {
        return false;
    }
    
    return url.protocol === "http:" || url.protocol === "https:";
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