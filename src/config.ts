import type { LavalinkNodeOptions } from "lavalink-client";

export interface HinagiConfig {
    colors: {
        error: number;
        success: number;
        warning: number;
    };
    nodes: LavalinkNodeOptions[];
    prefixes: string[];
    emojis: {
        error: string;
        success: string;
        previous: string;
        pause: string;
        next: string;
        stop: string;
        queue: string;
    };
}

export const Configuration: HinagiConfig = {
    colors: {
        error: 0x960018,
        success: 0x007cff,
        warning: 0xe1ad01
    },
    prefixes: ["hina", "h!", "hinagi"],
    emojis: {
        error: "",
        success: "",
        previous: "<:previous:1223972675983249408>",
        pause: "<:pause:1223972673785299014>",
        next: "<:next:1223972671738609676>",
        stop: "<:stop:1230898078601449483>",
        queue: "<:queue:1231066304782274645>",
    },
    nodes: [
        {
            id: "Node Hinagi",
            host: process.env.LAVALINK_HOST!,
            port: Number(process.env.LAVALINK_PORT),
            authorization: process.env.LAVALINK_AUTHORIZATION!,
        },
    ],
};
