import { BaseHandler } from 'seyfert/lib/common';
import type { UsingClient } from 'seyfert';
import { resolve } from 'path';
import { Lavalink } from './Lavalink';

export class Handler extends BaseHandler {
    constructor(private client: UsingClient) {
        super(client.logger);
    }

    async load() {
        const eventsDir = resolve('dist', 'lavalink');
        const files = await this.loadFilesK<Lavalink>(await this.getFiles(eventsDir));

        for await (const file of files) {
            const path = file.path.split(process.cwd()).slice(1).join(process.cwd());
            const event: Lavalink = file.file;

            if (!event || !(event instanceof Lavalink)) {
                this.logger.warn(`${path} doesn't export by \`export default new Lavalink({ ... })\``);
                continue;
            }

            if (!event.name) {
                this.logger.warn(`${path} doesn't have a \`name\``);
                continue;
            }

            const run = (...args: any) => event.run(this.client, ...args);

            if (event.isNode()) this.client.manager.nodeManager.on(event.name, run);
            else if (event.isManager()) this.client.manager.on(event.name, run);
        }
    }
}