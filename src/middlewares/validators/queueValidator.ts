import { MessageFlags } from "discord-api-types/v10";
import { type ComponentContext, createMiddleware, type MiddlewareContext } from "seyfert";

export const checkQueueExists: MiddlewareContext = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client } = context;
    const player = client.manager.getPlayer(context.guildId as string);

    if (!player) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ There is no queue for this server, try playing a track first!'
        });

        return pass();
    }

    return next();
});

export const checkHistoryExists: MiddlewareContext = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client } = context;
    const player = client.manager.getPlayer(context.guildId as string);

    if (!player?.queue.previous.length) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ You cannot perform this action as there are no previous tracks played in the queue!'
        });

        return pass();
    }

    return next();
});

export const checkQueueEmpty = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client } = context;
    const player = client.manager.getPlayer(context.guildId as string);
    
    if (player && !player?.queue.tracks.length) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ You cannot perform this action as the queue is empty!'
        });

        return pass();
    }

    return next();
});

export const checkTrackExists = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client, interaction } = context;
    const player = client.manager.getPlayer(context.guildId as string);
    
    const messageId = player?.get<string>('messageId') ?? '';

    if (interaction.isButton() && interaction.message.id !== messageId) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ It looks like this track has been skipped or is no longer in the queue.'
        });

        return pass();
    }

    return next();
});

export const checkQueueNotPlaying = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client } = context;
    const player = client.manager.getPlayer(context.guildId as string);
    
    if (player && !player.playing) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ You cannot perform this action as the music playback is currently inactive!'
        });

        return pass();
    }

    return next();
});

export const checkAutoplayRequirements = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client } = context;
    const player = client.manager.getPlayer(context.guildId as string);
    const tracksNeeded = player.queue.tracks.length >= 2;

    if (player && !tracksNeeded) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ Two or more tracks are required to be in the queue for this feature to work!'
        });

        return pass();
    }

    return next();
});