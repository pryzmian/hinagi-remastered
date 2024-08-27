import { Command, type CommandContext, Declare, Middlewares, Options, createIntegerOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

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

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueNotPlaying"])
export default class ExampleCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { position } = options;

        const player = client.manager.getPlayer(ctx.guildId!);
        const targetTrack = position ? player.queue.tracks[position - 1] : player.queue.current;

        if (position && position > player.queue.tracks.length) {
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        color: client.config.colors.error,
                        description: `${client.config.emojis.error} The track at position ${position} does not exist!`,
                    },
                ],
            });
        }

        await player.skip(position, false);
        await ctx.write({
            embeds: [
                {
                    color: client.config.colors.success,
                    description: `${client.config.emojis.success} Skipped ${position ? `to track [${targetTrack?.info.title}](${targetTrack?.info.uri})` : `[${targetTrack?.info.title}](${targetTrack?.info.uri})`}.`,
                },
            ],
        });
    }
}
