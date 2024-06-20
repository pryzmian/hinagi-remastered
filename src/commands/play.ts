import { Command, Declare, type CommandContext, Options, createStringOption } from 'seyfert';
import { MessageFlags } from 'discord-api-types/v10';

const spliceName = (text: string) => text.length > 100 ? `${text.substring(0, 50)}...` : text;

const options = {
    query: createStringOption({
        description: 'The song to play',
        required: true,
        autocomplete: async (int) => {
            const { client } = int;

            const query = int.getInput();
            if (!query) return int.respond([{ name: 'No results found.', value: 'https://youtu.be/dQw4w9WgXcQ?si=8_92jOrFRpPmHdXy' }]);

            const { tracks, playlist } = await client.manager.search(query);

            if (playlist) return int.respond([{
                name: `Playlist: ${spliceName(playlist.title)}`,
                value: playlist.uri ?? query
            }]);

            return int.respond(
                tracks.map(({ info }) => ({
                    name: `${spliceName(info.title)} (Author: ${info.author})`,
                    value: info.uri
                })).slice(0, 5)
            );
        }
    })
};

@Declare({
    name: 'play',
    aliases: ['p'],
    description: 'Play a song',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class PlayCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member, author } = ctx;
        const { query } = options;

        await ctx.deferReply();

        const me = ctx.me();
        if (!me) return;

        const voice = member?.voice();
        const bot = me.voice();

        if (!voice)
            return ctx.editOrReply({
                content: '',
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
                content: '',
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'You need to be in the same voice channel as me to play music!',
                        color: client.config.color
                    }
                ]
            });

        const permissions = await client.channels.memberPermissions(voice.channelId!, me);
        const missings = permissions.keys(permissions.missings(['Connect', 'Speak', 'ViewChannel']));

        if (missings.length)
            return ctx.editOrReply({
                content: '',
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: `I am missing the following permissions: ${missings.join(', ')}`,
                        color: client.config.color
                    }
                ]
            });

        const player = client.manager.createPlayer({
            guildId: ctx.guildId!,
            voiceChannelId: voice.channelId!,
            textChannelId: ctx.channelId!,
            selfDeaf: true,
            volume: 50
        });

        const { loadType, playlist, tracks } = await player.search({ query }, author);

        player.set('commandContext', ctx);

        switch (loadType) {
            case 'empty':
            case 'error': {
                if (!player.queue.current) await player.destroy();

                await ctx.editOrReply({
                    content: '',
                    embeds: [
                        {
                            color: client.config.color,
                            description: 'No results found for the specified song!'
                        }
                    ]
                });
            }
                break;

            case 'playlist': {
                if (!player.connected) await player.connect();
                if (!playlist) return;

                await player.queue.add(tracks);
                await ctx.editOrReply({
                    content: '',
                    embeds: [
                        {
                            color: client.config.color,
                            description: `Queued playlist [${playlist.title}](${playlist.uri ?? query}) with \`${tracks.length}\` songs!`
                        }
                    ]
                });

                if (!player.playing) await player.play();
            }
                break;

            case 'search':
            case 'track': {
                if (!player.connected) await player.connect();

                const track = tracks[0];

                await player.queue.add(track);
                await ctx.editOrReply({
                    content: '',
                    embeds: [
                        {
                            color: client.config.color,
                            description: `Queued [${tracks[0].info.title}](${tracks[0].info.uri})!`
                        }
                    ]
                });

                if (!player.playing) await player.play();
            }
                break;
        }
    }
}
