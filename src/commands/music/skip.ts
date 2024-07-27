import { MessageFlags } from "discord-api-types/v10";
import { SubCommand, type CommandContext, Declare, Middlewares, Options, createIntegerOption } from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

const options = {
    position: createIntegerOption({
        description: "The position of the song to skip to.",
    }),
};

@Declare({
    name: "skip",
    description: "Skips the current song.",
    aliases: ["s"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueEmpty", "checkQueueNotPlaying"])
export default class ExampleCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { position } = options;

        const player = client.manager.getPlayer(ctx.guildId!);

        if (position && position > player.queue.tracks.length)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [{
                    description: `❌ There is no song at position ${position} to skip to!`,
                    color: client.config.colors.error,
                }],
            });

        if (position) {
            await player.skip(position);
            await ctx.editOrReply({
                embeds: [{
                    description: `Skipped to track at position **${position}**`,
                    color: client.config.colors.success
                }]
            });
        } else {
            await player.skip(undefined, false);
            await ctx.editOrReply({
                embeds: [{
                    description: "Skipped the current song!",
                    color: EmbedColors.Green
                }]
            });
        }
    }
}
