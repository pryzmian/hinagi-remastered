// This file contains hardcoded typed and functions of nekos.life API.
// So, don't ask me why I did this.

interface QueryParams {
    text: string;
}
interface RequestResults {
    url: string;
}
interface ChatResults {
    response: string;
    url?: string;
}
interface CatResult {
    cat: string;
}
interface WhyResult {
    why: string;
}
interface OwOResult {
    owo: string;
}
interface FactResult {
    fact: string;
}

type Results = {
    [key in NekoImageType | NekoSpecialType]: key extends NekoSpecialType
        ? key extends NekoSpecialType.Why
            ? WhyResult
            : key extends NekoSpecialType.CatText
              ? CatResult
              : key extends NekoSpecialType.OwOify | NekoSpecialType.Spoiler
                ? OwOResult
                : key extends NekoSpecialType.EightBall
                  ? ChatResults
                  : FactResult
        : RequestResults;
};

type QueryParameters = {
    [key in NekoImageType]: never;
} & {
    [key in NekoSpecialType]: key extends NekoSpecialType.OwOify | NekoSpecialType.EightBall | NekoSpecialType.Spoiler
        ? QueryParams
        : never;
};

export enum NekoImageType {
    Tickle = "/img/tickle",
    Slap = "/img/slap",
    Poke = "/img/poke",
    Pat = "/img/pat",
    Neko = "/img/neko",
    Meow = "/img/meow",
    Lizard = "/img/lizard",
    Kiss = "/img/kiss",
    Hug = "/img/hug",
    FoxGirl = "/img/fox_girl",
    Feed = "/img/feed",
    Cuddle = "/img/cuddle",
    NekoGif = "/img/ngif",
    Kemonomimi = "/img/kemonomimi",
    Holo = "/img/holo",
    Smug = "/img/smug",
    Baka = "/img/baka",
    Woof = "/img/woof",
    Wallpaper = "/img/wallpaper",
    Goose = "/img/goose",
    Gecg = "/img/gecg",
    Avatar = "/img/avatar",
    Waifu = "/img/waifu",
}

export enum NekoSpecialType {
    Why = "/why",
    CatText = "/cat",
    OwOify = "/owoify",
    EightBall = "/8ball",
    Fact = "/fact",
    Spoiler = "/spoiler",
}

type NekoType = NekoImageType | NekoSpecialType;

export async function getNeko<T extends NekoType = NekoType>(type: T, query?: QueryParameters[T]): Promise<Results[T]> {
    const url = new URL(`https://nekos.life/api/v2/${type}`);
    if (query) url.search = new URLSearchParams(`${query}`).toString();

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Request failed. Status code: ${res.status}`);

    return res.json();
}
