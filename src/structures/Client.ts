import { Client } from "seyfert";
import { Yuna } from "yunaforseyfert";

import { HandleCommand } from "seyfert/lib/commands/handle";

import type { HinagiConfig } from "../config";
import { Configuration } from "../config";

import { HinagiMiddlewares } from "../middlewares";
import { Manager } from "./Manager";

import { Database } from "./Database";

const RANDOM_RESPONSES = [
    "Beep boop! Doing the thing...",
    ":thinking:",
    "I'm on it!",
    "Sure thing!",
    "Got it!",
    "Alright!",
    "Processing...",
    "*Makes machine noises*",
];

export class HinagiClient extends Client<true> {
    readonly manager: Manager;
    readonly database: Database;
    readonly config: HinagiConfig = Configuration;

    constructor() {
        super({
            allowedMentions: {
                replied_user: false,
            },
            commands: {
                reply: () => true,
                prefix: async (message) => {
                    const guildPrefix = await this.database.getPrefix(message.guildId!);
                    return [guildPrefix, this.config.defaultPrefix, ...this.config.prefixes];
                },
                deferReplyResponse: ({ client }) => ({
                    embeds: [
                        {
                            color: client.config.colors.transparent,
                            description: RANDOM_RESPONSES[Math.floor(Math.random() * RANDOM_RESPONSES.length)],
                        },
                    ],
                }),
                defaults: {
                    async onOptionsError(context, metadata) {
                        const { client } = context;
                        const errorString = Object.entries(metadata)
                            .filter((_) => _[1].failed)
                            .map((error) => `\`${error[0]}\`: ${error[1].value}`)
                            .join("\n");

                        await context.editOrReply({
                            embeds: [
                                {
                                    color: client.config.colors.error,
                                    title: "Error parsing options",
                                    description: `${client.config.emojis.error} ${errorString}`,
                                    timestamp: new Date().toISOString(),
                                },
                            ],
                        });
                    },
                },
            },
        });

        this.manager = new Manager(this);
        this.database = new Database(this);
        this.run();
    }

    public async run(): Promise<void> {
        this.setServices({
            middlewares: HinagiMiddlewares,
            handleCommand: class extends HandleCommand {
                argsParser = Yuna.parser({
                    syntax: {
                        namedOptions: ["-", "--"],
                    },
                    useRepliedUserAsAnOption: {
                        requirePing: false,
                    },
                });
            },
            cache: {
                disabledCache: {
                    overwrites: true,
                    roles: true,
                    emojis: true,
                    channels: true,
                    threads: true,
                    stickers: true,
                    presences: true,
                    stageInstances: true,
                    bans: true,
                },
            },
        });

        await this.start();
        await this.uploadCommands();
        await this.manager.load();
    }
}
