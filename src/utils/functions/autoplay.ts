import type { Player, Track } from "lavalink-client";

/**
 * Function to handle autoplay logic for the player.
 * @param player The player object.
 * @param lastTrack The last played track.
 */
export async function autoPlayFunction(player: Player, lastTrack: Track) {
    if (!player.get<boolean | undefined>("enabledAutoplay")) return;

    if (lastTrack.info.sourceName === "spotify") {
        const filtered = player.queue.previous.filter(({ info }) => info.sourceName === "spotify").slice(0, 5);
        const ids = filtered.map(
            ({ info }) => info.identifier || info.uri.split("/")?.reverse()?.[0] || info.uri.split("/")?.reverse()?.[1],
        );
        if (ids.length >= 1) {
            const res = await player.search({ query: `seed_tracks=${ids.join(",")}`, source: "sprec" }, lastTrack.requester);
            const track = res.tracks.filter((v) => !player.queue.previous.find((t) => t.info.identifier === v.info.identifier))[
                Math.floor(Math.random() * res.tracks.length) ?? 1
            ] as Track;
            player.queue.previous.push(track);
            if (res.tracks.length) {
                track.requester = player.get("clientUser")
                await player.queue.add(track);
            }
        }
    } else if (["youtube", "youtubemusic"].includes(lastTrack.info.sourceName)) {
        const search = `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`;
        const res = await player.search({ query: search }, lastTrack.requester);
        const track = res.tracks.filter((v) => !player.queue.previous.find((t) => t.info.identifier === v.info.identifier))[
            Math.floor(Math.random() * res.tracks.length) ?? 1
        ] as Track;
        player.queue.previous.push(track);
        if (res.tracks.length) {
            track.requester = player.get("clientUser")
            await player.queue.add(track);
        }
    }
}
