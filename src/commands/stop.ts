import { Command, type CommandContext, Declare, Middlewares } from "seyfert";

@Declare({
    name: "stop",
    description: "Stops the current queue.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["checkVoiceChannel", "checkQueueExists"])
export default class ExampleCommand extends Command {
    async run(ctx: CommandContext) {
        const { client } = ctx;
        const player = client.manager.getPlayer(ctx.guildId!);

        await player.destroy();
        await ctx.write({
            embeds: [
                {
                    color: client.config.colors.success,
                    description: `${client.config.emojis.success} Queue stopped!`,
                },
            ],
        });
    }
}
