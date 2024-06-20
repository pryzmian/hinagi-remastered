import { MessageFlags } from 'discord-api-types/v10';
import { Command, Declare, CommandContext, Embed } from 'seyfert';
import { EmbedPaginator } from '../structures/Paginator';

@Declare({
    name: 'queue',
    description: 'Displays the current queue.',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
export default class AutoplayCommand extends Command {
    async run(ctx: CommandContext) {
        const { client, member } = ctx;

        const me = ctx.me();
        if (!me) return;

        const voice = member?.voice();
        const bot = me.voice();

        if (!voice)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'You need to be in a voice channel to play music!',
                        color: client.config.color
                    }
                ]
            });

        if (bot && voice.channelId !== bot.channelId)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'You need to be in the same voice channel as me to play music!',
                        color: client.config.color
                    }
                ]
            });

        const player = client.manager.getPlayer(ctx.guildId!);
        if (!player)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'There are no tracks currently playing and no tracks in the queue, try adding some tracks!',
                        color: client.config.color
                    }
                ]
            });

        if (!player.queue.tracks.length)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'There are no tracks!',
                        color: client.config.color
                    }
                ]
            });

        const tracksPerPage = 10;
        const tracks = player.queue.tracks.map(({ info }, index) => `**${index + 1}.** \`${info.duration ?? '0:0'}\` | [**${info.title}**](${info.uri})`);
        const current = player.queue.current!;
        const paginator = new EmbedPaginator(ctx);

        if (tracks.length < tracksPerPage) {
            await ctx.editOrReply({
                embeds: [
                    new Embed()
                        .setThumbnail(current.info.artworkUrl ?? '')
                        .setColor('Default')
                        .setDescription(`**Now Playing:**\n\`${current.info.duration}\` | [**${current.info.title}**](${current.info.duration})\n\n**Up Next:**\n${tracks.slice(0, tracksPerPage).join('\n')}`)
                ]
            });
        } else {
            for (let i = 0; i < tracks.length; i += tracksPerPage) {
                paginator.addEmbed(
                    new Embed()
                        .setThumbnail(current.info.artworkUrl ?? '')
                        .setColor('Default')
                        .setDescription(`**Now Playing:**\n\`${current.info.duration}\` | [**${current.info.title}**](${current.info.duration})\n\n**Up Next:**\n${tracks.slice(i, i + tracksPerPage).join('\n')}`)
                );
            }

            await paginator.reply();
        }
    }
}