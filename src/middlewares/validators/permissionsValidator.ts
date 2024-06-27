import { MessageFlags } from "discord-api-types/v10";
import { createMiddleware } from "seyfert";

export const checkPermissions = createMiddleware<void>(async ({ context, next, pass }) => {
    const { client, member } = context;
    
    const me = context.me();
    if (!me) return;

    const voice = member?.voice();

    const permissions = await client.channels.memberPermissions(voice?.channelId as string, me);
    const missings = permissions.keys(permissions.missings(['Connect', 'Speak', 'ViewChannel']));

    if (missings.length) {
        await context.editOrReply({
            content: `❌ I am missing the following permissions to play music in ${await me.voice()?.channel()}: ${missings.join(', ')}`,
            flags: MessageFlags.Ephemeral
        });

        return pass();
    }

    return next();
});