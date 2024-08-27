import { Command, type CommandContext, Declare, Embed, Middlewares } from "seyfert";
import { EmbedPaginator } from "../structures/Paginator";
import { parseTime } from "../utils/functions/parseTime";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
    name: "queue",
    description: "Displays the current queue.",
    aliases: ["q"],
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Middlewares(["checkVoiceChannel", "checkQueueExists"])
export default class QueueCommand extends Command {
    async run(ctx: CommandContext) {
        const { client } = ctx;
        const player = client.manager.getPlayer(ctx.guildId!);
        const tracksPerPage = 10;
        const tracks = player.queue.tracks.map(({ info }, index) =>
            `**${index + 1}.** \`${parseTime(info.duration!)}\` | [**${info.title}**](${info.uri})`
        );
        const current = player.queue.current;
        const paginator = new EmbedPaginator(ctx);

        const nowPlayingDescription = `**Now Playing:**\n\`${parseTime(current?.info.duration!)}\` | [**${current?.info.title}**](${current?.info.uri})\n\n**Up Next:**\n`;

        if (tracks.length === 0) {
            return ctx.write({
                flags: MessageFlags.Ephemeral,
                embeds: [{
                    color: client.config.colors.success,
                    description: `${nowPlayingDescription}No tracks in queue. Add some tracks with the \`play\` command.`,
                }],
            });
        }

        if (tracks.length < tracksPerPage) {
            await ctx.write({
                embeds: [{
                    color: client.config.colors.success,
                    thumbnail: { url: current?.info.artworkUrl ?? "" },
                    description: nowPlayingDescription + tracks.join("\n"),
                }],
            });
        } else {
            for (let i = 0; i < tracks.length; i += tracksPerPage) {
                paginator.addEmbed(
                    new Embed()
                        .setColor(client.config.colors.success)
                        .setThumbnail(current?.info.artworkUrl ?? "")
                        .setDescription(nowPlayingDescription + tracks.slice(i, i + tracksPerPage).join("\n"))
                );
            }

            await paginator.reply();
        }
    }
}
