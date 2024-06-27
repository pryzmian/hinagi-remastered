import { MessageFlags } from "discord-api-types/v10";
import { type ComponentContext, createMiddleware, type MiddlewareContext } from "seyfert";

export const checkQueue: MiddlewareContext = createMiddleware<void, ComponentContext<'Button'>>(async ({ context, next, pass }) => {
    const { client } = context;
    const player = client.manager.getPlayer(context.guildId as string);

    if (!player) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content:
                '❌ There is no queue for this server, try adding some tracks first!'
        });

        return pass();
    }

    if (!player.queue.tracks.length) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: '❌ There are no tracks in the queue, try adding some tracks first!'
        });

        return pass();
    }

    return next();
});