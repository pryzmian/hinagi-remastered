import { SubCommand, type CommandContext, Declare, Middlewares, Options, createStringOption } from "seyfert";

const spliceName = (text: string) => (text.length > 100 ? `${text.substring(0, 50)}...` : text);

const options = {
    query: createStringOption({
        description: "The song to play",
        required: true,
        autocomplete: async (int) => {
            const { client } = int;

            const query = int.getInput();
            if (!query) return int.respond([{ name: "No results found.", value: "https://youtu.be/dQw4w9WgXcQ?si=8_92jOrFRpPmHdXy" }]);

            const { tracks, playlist } = await client.manager.search(query);

            if (playlist)
                return int.respond([
                    {
                        name: `Playlist: ${spliceName(playlist.title)}`,
                        value: playlist.uri ?? query,
                    },
                ]);

            return int.respond(
                tracks
                    .map(({ info }) => ({
                        name: `${spliceName(info.title)} (Author: ${info.author})`,
                        value: info.uri,
                    }))
                    .slice(0, 5),
            );
        },
    }),
};

@Declare({
    name: "play",
    aliases: ["p"],
    description: "Play a song",
    integrationTypes: ["GuildInstall"],
    props: {
        usage: "play <query>",
        examples: ["play Never Gonna Give You Up", "/play https://open.spotify.com/track/3Bl4JMJGwjIoFZmD1r48P9?si=c56e4e8d4c8a4d63"],
    },
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["checkVoiceChannel"])
export default class PlayCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member, author } = ctx;
        const { query } = options;

        const voice = await member?.voice()?.channel();

        await ctx.deferReply();

        const player = client.manager.createPlayer({
            guildId: ctx.guildId!,
            voiceChannelId: voice?.id!,
            textChannelId: ctx.channelId!,
            selfDeaf: true,
            volume: 100,
        });

        const { loadType, playlist, tracks } = await player.search({ query }, author);

        player.set("commandContext", ctx);

        if (!player.connected) await player.connect();

        switch (loadType) {
            case "empty":
            case "error":
                {
                    if (!player.queue.current) await player.destroy();

                    await ctx.editOrReply({
                        content: `❌ I couldn't find any results for \`${query}\`!`,
                    });
                }
                break;

            case "playlist":
                {
                    if (!playlist) return;

                    await player.queue.add(tracks);
                    await ctx.editOrReply({
                        content: `✅ Queued playlist [${playlist.title}](<${playlist.uri ?? query}>) with \`${tracks.length}\` songs!`,
                    });

                    if (!player.playing) await player.play();
                }
                break;

            case "search":
            case "track":
                {
                    if (!player.connected) await player.connect();

                    const track = tracks[0];

                    await player.queue.add(track);
                    await ctx.editOrReply({
                        content: `✅ Queued [${tracks[0].info.title}](<${tracks[0].info.uri}>) by [${tracks[0].info.author}](<${tracks[0].info.uri}>)!`,
                    });

                    if (!player.playing) await player.play();
                }
                break;
        }
    }
}
