import type { LavalinkNodeOptions } from 'lavalink-client';

export interface HinagiConfig {
    color: number;
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
    color: 0x007cff,
    prefixes: ['hina', 'h!', 'hinagi'],
    emojis: {
        error: '',
        success: '',
        previous: '<:previous:1223972675983249408>',
        pause: '<:pause:1223972673785299014>',
        next: '<:next:1223972671738609676>',
<<<<<<< HEAD
        stop: '<:stop:1230898078601449483>',
        queue: '<:queue:1231066304782274645>',
=======
        stop: '<:stop:1230898078601449483>'
>>>>>>> 128c2edaae0b1a03ca24b2830ce9037ce425baa0
    },
    nodes: [
        {
            id: 'Node 0',
            host: 'localhost',
            port: 2333,
            authorization: 'ganyuontopuwu'
        }
    ]
};
