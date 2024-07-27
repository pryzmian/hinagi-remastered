import { MessageFlags } from "discord-api-types/v10";
import { type ComponentContext, type MiddlewareContext, createMiddleware } from "seyfert";

const createErrorReply = async (context: ComponentContext<"Button">, description: string) => {
    const { client } = context;
    await context.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [{
            color: client.config.colors.error,
            description: `❌ ${description}`
        }]
    });
};

const getPlayer = (context: ComponentContext<"Button">) => {
    const { client, guildId } = context;
    return client.manager.getPlayer(guildId!);
};

export const checkQueueExists: MiddlewareContext = createMiddleware<void, ComponentContext<"Button">>(async ({ context, next, pass }) => {
    const player = getPlayer(context);

    if (!player) {
        await createErrorReply(context, "There is no queue for this server, try playing a track first!");
        return pass();
    }

    return next();
});

export const checkHistoryExists: MiddlewareContext = createMiddleware<void, ComponentContext<"Button">>(async ({ context, next, pass }) => {
    const player = getPlayer(context);

    if (!player?.queue.previous.length) {
        await createErrorReply(context, "You cannot perform this action as there are no previous tracks played in the queue!");
        return pass();
    }

    return next();
});

export const checkQueueEmpty: MiddlewareContext = createMiddleware<void, ComponentContext<"Button">>(async ({ context, next, pass }) => {
    const player = getPlayer(context);

    if (player && !player.queue.tracks.length) {
        await createErrorReply(context, "You cannot perform this action as the queue is empty!");
        return pass();
    }

    return next();
});

export const checkTrackExists: MiddlewareContext = createMiddleware<void, ComponentContext<"Button">>(async ({ context, next, pass }) => {
    const { interaction } = context;
    const player = getPlayer(context);
    const messageId = player?.get<string>("messageId") ?? "";

    if (interaction.isButton() && interaction.message.id !== messageId) {
        await createErrorReply(context, "It looks like this track has been skipped or is no longer in the queue.");
        return pass();
    }

    return next();
});

export const checkQueueNotPlaying: MiddlewareContext = createMiddleware<void, ComponentContext<"Button">>(async ({ context, next, pass }) => {
    const player = getPlayer(context);

    if (player && !player.playing) {
        await createErrorReply(context, "You cannot perform this action as the music playback is currently inactive!");
        return pass();
    }

    return next();
});

export const checkAutoplayRequirements: MiddlewareContext = createMiddleware<void, ComponentContext<"Button">>(async ({ context, next, pass }) => {
    const player = getPlayer(context);
    const tracksNeeded = player.queue.tracks.length >= 2;

    if (player && !tracksNeeded) {
        await createErrorReply(context, "Two or more tracks are required to be in the queue for this feature to work!");
        return pass();
    }

    return next();
});
