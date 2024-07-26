import { Command, type CommandContext, Declare, Middlewares } from "seyfert";

@Declare({
    name: "shuffle",
    description: "Shuffle the current queue.",
    aliases: ["sh"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueEmpty", "checkQueueNotPlaying"])
export default class ShuffleCommand extends Command {
    async run(ctx: CommandContext) {
        const { client } = ctx;

        const player = client.manager.getPlayer(ctx.guildId!);

        await player.queue.shuffle();
        await ctx.editOrReply({
            embeds: [{
                description: "The queue has been shuffled!",
                color: client.config.colors.success,
            }],
        });
    }
}
