import { Client } from 'seyfert';
import { YunaParser } from 'yunaforseyfert';

import { HandleCommand } from 'seyfert/lib/commands/handle';

import type { HinagiConfig } from '../config';
import { Configuration } from '../config';

import { Manager } from './Manager';
import { HinagiMiddlewares } from '../middlewares';

export class HinagiClient extends Client {
    readonly manager: Manager;
    readonly config: HinagiConfig = Configuration;

    constructor() {
        super({
            allowedMentions: {
                replied_user: false
            },
            commands: {
                reply: () => true,
                prefix: () => this.config.prefixes,
                deferReplyResponse: ({ client }) => ({ content: `**${client.me?.username}** is thinking...` }),
                defaults: {
                    async onOptionsError(context, metadata) {
                        await context.editOrReply({
                            embeds: [
                                {
                                    title: 'Invalid options provided!',
                                    description: Object.entries(metadata)
                                        .filter((_) => _[1].failed)
                                        .map((error) => `\`${error[0]}\`: ${error[1].value}`)
                                        .join('\n'),
                                    color: 0x007cff
                                }
                            ]
                        });
                    }
                }
            }
        });

        this.manager = new Manager(this);
        this.run();
    }

    public async run(): Promise<void> {
        this.setServices({
            middlewares: HinagiMiddlewares
        });
        
        await this.start();
        await this.uploadCommands();
        await this.manager.load();
    }
}
