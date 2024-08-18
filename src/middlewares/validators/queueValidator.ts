import { MessageFlags } from "discord-api-types/v10";
import { type MiddlewareContext, createMiddleware } from "seyfert";
import type { AnyContext } from "../../utils/types";

const createErrorReply = async (context: AnyContext, description: string) => {
    const { client } = context;
    await context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [{
            color: client.config.colors.error,
            description: `❌ ${description}`
        }]
    });
};

export const checkQueueExists: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId } = context;
    const player = client.manager.getPlayer(guildId!);

    if (!player) {
        await createErrorReply(context, "There is no queue for this server, try playing a track first!");
        return pass();
    }

    return next();
});

export const checkHistoryExists: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId } = context;
    const player = client.manager.getPlayer(guildId!);

    if (!player?.queue.previous.length) {
        await createErrorReply(context, "You cannot perform this action as there are no previous tracks played in the queue!");
        return pass();
    }

    return next();
});

export const checkQueueEmpty: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId } = context;
    const player = client.manager.getPlayer(guildId!);
    const isAutoplayActive = !!player.get<boolean>("enabledAutoplay");

    if (!isAutoplayActive && !player.queue.tracks.length) {
        await createErrorReply(context, "You cannot perform this action because the queue is empty!")
        return pass();
    }

    return next();
});

export const checkTrackExists: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);
    const messageId = player?.get<string>("messageId") ?? "";

    if (interaction?.message?.id !== messageId) {
        await createErrorReply(context, "It looks like this track has been skipped or is no longer in the queue.");
        return pass();
    }

    return next();
});

export const checkQueueNotPlaying: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId } = context;
    const player = client.manager.getPlayer(guildId!);

    if (player && !player.playing) {
        await createErrorReply(context, "You cannot perform this action as the music playback is currently inactive!");
        return pass();
    }

    return next();
});

export const checkAutoplayRequirements: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId } = context;
    const player = client.manager.getPlayer(guildId!);
    const tracksNeeded = player!.queue.tracks.length + Number(!!player.queue.current) >= 1;
    const isAutoplayActive = !!player.get<boolean>("enabledAutoplay");
    
    if (!tracksNeeded && isAutoplayActive) {
        await createErrorReply(context, "You cannot enable the autoplay feature as there are no tracks in the queue!");
        return pass();
    }
    
    return next();
});
