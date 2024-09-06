import { resolve } from "node:path";
import type { UsingClient } from "seyfert";
import { BaseHandler } from "seyfert/lib/common";
import type { Lavalink } from "./Lavalink";

const isWindows = process.platform === "win32";
const isDev = process.argv.includes("--dev");

const output = isWindows && isDev ? "src" : "dist";

export class Handler extends BaseHandler {
    constructor(private client: UsingClient) {
        super(client.logger);
    }

    async load() {
        const eventsDir = resolve(output, "lavalink");
        const files = await this.loadFilesK<{ default: Lavalink }>(await this.getFiles(eventsDir));

        for await (const file of files) {
            const path = file.path.split(process.cwd()).slice(1).join(process.cwd());
            const event: Lavalink = file.file.default;

            if (!event) {
                this.logger.warn(`${path} doesn't export by \`export default new Lavalink({ ... })\``);
                continue;
            }

            if (!event.name) {
                this.logger.warn(`${path} doesn't have a \`name\``);
                continue;
            }

            if (typeof event.run !== "function") {
                this.logger.warn(`${path} doesn't have a \`run\` function`);
                continue;
            }

            const run = (...args: any) => event.run(this.client, ...args);

            if (event.isNode()) this.client.manager.nodeManager.on(event.name, run);
            else if (event.isManager()) this.client.manager.on(event.name, run);
        }
    }
}
