import { Command, type CommandContext, Declare } from "seyfert";

@Declare({
    name: "ping",
    description: "Check the bot's latency",
    props: {
        usage: "ping",
        examples: ["pong"],
    },
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class PingCommand extends Command {
    async run(ctx: CommandContext) {
        const { client } = ctx;

        await ctx.write({
            embeds: [
                {
                    color: client.config.colors.success,
                    description: `🏓 Pong! Latency is **${Math.floor(client.gateway.latency)}ms**.`,
                },
            ],
        });
    }
}
