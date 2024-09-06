import type { LavalinkNodeOptions } from "lavalink-client";

export interface HinagiConfig {
    prefixes: string[];
    defaultLanguage: string;
    defaultPrefix: string;
    nodes: LavalinkNodeOptions[];
    colors: {
        error: number;
        success: number;
        warning: number;
        info: number;
        transparent: number;
    };
    emojis: {
        error: string;
        success: string;
        warning: string;
        previous: string;
        pause: string;
        next: string;
        stop: string;
        queue: string;
        playing: string;
    };
}

export const Configuration: HinagiConfig = {
    defaultLanguage: "en_US",
    defaultPrefix: "h!",
    prefixes: ["hinagi", "hina"],
    colors: {
        error: 0xf44336,
        success: 0x2196f3,
        warning: 0xffc107,
        info: 0xffa500,
        transparent: 0x2f3136, // not really transparent, but it's the color of the dark theme background
    },
    emojis: {
        error: "<:error:1222874433728024596>",
        success: "<:check:1222874435019735040>",
        warning: "<:warning:1277672516147740734>",
        previous: "<:previous:1223972675983249408>",
        pause: "<:pause:1223972673785299014>",
        next: "<:next:1223972671738609676>",
        stop: "<:stop:1230898078601449483>",
        queue: "<:queue:1231066304782274645>",
        playing: "<:musicalnote:1277802192551547012>",
    },
    nodes: [
        {
            id: "Node Hinagi 1",
            host: process.env.LAVALINK_HOST!,
            port: Number(process.env.LAVALINK_PORT),
            authorization: process.env.LAVALINK_AUTHORIZATION!,
        },
    ],
};
