import { MessageFlags } from 'discord-api-types/v10';
import { Command, Declare, type CommandContext, Embed } from 'seyfert';
import { EmbedPaginator } from '../structures/Paginator';
import { parseTime } from '../utils/functions/parseTime';

@Declare({
    name: 'queue',
    description: 'Displays the current queue.',
    aliases: ['q'],
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
export default class AutoplayCommand extends Command {
    async run(ctx: CommandContext) {
        const { client } = ctx;
        const player = client.manager.getPlayer(ctx.guildId as string);

        const tracksPerPage = 10;
        const tracks = player.queue.tracks.map(
            ({ info }, index) =>
                `**${index + 1}.** \`${parseTime(info.duration as number) ?? '0:0'}\` | [**${info.title}**](${info.uri})`
        ) ?? 'No tracks in queue. Add some tracks with `play` command.';
        const current = player.queue.current ?? undefined;
        const paginator = new EmbedPaginator(ctx);

        if (tracks.length < tracksPerPage) {
            await ctx.editOrReply({
                embeds: [
                    new Embed()
                        .setThumbnail(current?.info.artworkUrl ?? '')
                        .setColor(client.config.color)
                        .setDescription(
                            `**Now Playing:**\n\`${parseTime(current?.info.duration as number)}\` | [**${current?.info.title}**](${current?.info.uri})\n\n**Up Next:**\n${tracks.slice(0, tracksPerPage).join('\n')}`
                        )
                ]
            });
        } else {
            for (let i = 0; i < tracks.length; i += tracksPerPage) {
                paginator.addEmbed(
                    new Embed()
                        .setThumbnail(current?.info.artworkUrl ?? '')
                        .setColor(client.config.color)
                        .setDescription(
                            `**Now Playing:**\n\`${parseTime(current?.info.duration as number)}\` | [**${current?.info.title}**](${current?.info.uri})\n\n**Up Next:**\n${tracks.slice(i, i + tracksPerPage).join('\n')}`
                        )
                );
            }

            await paginator.reply();
        }
    }
}