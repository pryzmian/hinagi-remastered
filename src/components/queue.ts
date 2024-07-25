import { MessageFlags } from "discord-api-types/v10";
import type { ComponentContext } from "seyfert";
import { ComponentCommand, Embed, Middlewares } from "seyfert";
import { EmbedPaginator } from "../structures/Paginator";
import { parseTime } from "../utils/functions/parseTime";

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueEmpty", "checkTrackExists"])
export default class QueueButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "queue-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        const tracksPerPage = 10;
        const tracks = player.queue.tracks.map(
            ({ info }, index) => `**${index + 1}.** \`${parseTime(info.duration as number) ?? "0:0"}\` | [**${info.title}**](${info.uri})`,
        );
        const current = player.queue.current ?? undefined;
        const paginator = new EmbedPaginator(ctx);

        if (tracks.length < tracksPerPage) {
            await ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    new Embed()
                        .setThumbnail(current?.info.artworkUrl ?? "")
                        .setColor(client.config.color)
                        .setDescription(
                            `**Now Playing:**\n\`${parseTime(current?.info.duration as number)}\` | [**${current?.info.title}**](${current?.info.uri})\n\n**Up Next:**\n${tracks.length ? tracks.splice(0, tracksPerPage).join("\n") : "No tracks in the queue. Add some tracks with `/play <song>"}`,
                        ),
                ],
            });
        } else {
            for (let i = 0; i < tracks.length; i += tracksPerPage) {
                paginator.addEmbed(
                    new Embed()
                        .setThumbnail(current?.info.artworkUrl ?? "")
                        .setColor(client.config.color)
                        .setDescription(
                            `**Now Playing:**\n\`${parseTime(current?.info.duration as number)}\` | [**${current?.info.title}**](${current?.info.uri})\n\n**Up Next:**\n${tracks.length ? tracks.splice(i, i + tracksPerPage).join("\n") : "No tracks in the queue. Add some tracks with `/play <song>"}`,
                        ),
                );
            }

            await paginator.reply(true);
        }
    }
}
