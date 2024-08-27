import { MessageFlags } from "seyfert/lib/types";
import { type MiddlewareContext, createMiddleware } from "seyfert";
import type { AnyContext } from "../../utils/types";

export const checkQueueExists: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);

    if (!player) {
        await interaction?.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} There is no active queue in this server!`
            }]
        });
        return pass();
    }

    return next();
});

export const checkHistoryExists: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);

    if (!player?.queue.previous.length) {
        await interaction?.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} There are no tracks in the history!`
            }]
        });
        return pass();
    }

    return next();
});

export const checkQueueEmpty: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);
    const isAutoplayActive = !!player.get<boolean>("enabledAutoplay");

    if (!isAutoplayActive && !player.queue.tracks.length) {
        await interaction?.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} The queue is empty, try adding a track to the queue first!`
            }]
        });
        return pass();
    }

    return next();
});

export const checkTrackExists: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);
    const messageId = player?.get<string>("messageId") ?? "";

    if (interaction?.message?.id !== messageId)
        return await interaction?.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} This track is no longer in the queue or has been skipped!`
            }]
        });

    return next();
});

export const checkQueueNotPlaying: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);

    if (player && !player.playing) {
        await interaction?.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} The queue is not playing, try resuming or adding a track to the queue first!`
            }]
        });
        return pass();
    }

    return next();
});

export const checkAutoplayRequirements: MiddlewareContext = createMiddleware<void, AnyContext>(async ({ context, next, pass }) => {
    const { client, guildId, interaction } = context;
    const player = client.manager.getPlayer(guildId!);
    const tracksNeeded = player!.queue.tracks.length + Number(!!player.queue.current) >= 1;
    const isAutoplayActive = !!player.get<boolean>("enabledAutoplay");

    if (!tracksNeeded && isAutoplayActive) {
        await interaction?.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} You need to add at least one track to the queue to enable autoplay!`
            }]
        })
        return pass();
    }

    return next();
});
