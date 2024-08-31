import { Client } from "seyfert";
import { Yuna } from "yunaforseyfert";

import { HandleCommand } from "seyfert/lib/commands/handle";

import type { HinagiConfig } from "../config";
import { Configuration } from "../config";

import { HinagiMiddlewares } from "../middlewares";
import { Manager } from "./Manager";

import getCommandProps from "../utils/functions/getCommandProps";

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
    readonly config: HinagiConfig = Configuration;

    constructor() {
        super({
            allowedMentions: {
                replied_user: false,
            },
            commands: {
                reply: () => true,
                prefix: () => this.config.prefixes,
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
                            .map((error) => `❌ The option \`${error[0]}\` is required but got \`undefined\`!`)
                            .join("\n");
                        const commandProps = getCommandProps(context);

                        await context.editOrReply({
                            embeds: [
                                {
                                    color: client.config.colors.warning,
                                    title: "Invalid command usage!",
                                    description: `${errorString}\n\n${commandProps}`,
                                    footer: {
                                        text: "Note: <> means required, [] means optional.",
                                    },
                                    timestamp: new Date().toISOString(),
                                },
                            ],
                        });
                    },
                },
            },
        });

        this.manager = new Manager(this);
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
        });

        await this.start();
        await this.uploadCommands();
        await this.manager.load();
    }
}
