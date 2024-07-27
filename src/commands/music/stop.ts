import { SubCommand, type CommandContext, Declare, Middlewares } from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

@Declare({
    name: "stop",
    description: "Stops the current queue.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueEmpty", "checkQueueNotPlaying"])
export default class ExampleCommand extends SubCommand {
    async run(ctx: CommandContext) {
        const { client } = ctx;

        const player = client.manager.getPlayer(ctx.guildId!);

        await player.destroy();
        await ctx.editOrReply({ embeds: [{ description: "Stopped the queue!", color: EmbedColors.Green }] });
    }
}
