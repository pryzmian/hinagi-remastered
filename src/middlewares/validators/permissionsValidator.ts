import { MessageFlags } from "discord-api-types/v10";
import { createMiddleware } from "seyfert";

export const checkPermissions = createMiddleware<void>(async ({ context, next, pass }) => {
    const { client, member } = context;

    const me = context.me();
    if (!me) return;

    const voice = client.cache.voiceStates?.get(member?.id!, context.guildId!)
    const botChannel = await client.cache.voiceStates?.get(client.me?.id!, context.guildId!)?.channel();

    const permissions = await client.channels.memberPermissions(voice?.channelId!, me);
    const missings = permissions.keys(permissions.missings(["Connect", "Speak", "ViewChannel"]));

    if (missings.length) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `❌ I am missing the following permissions to play music in ${botChannel}: ${missings.join(", ")}`,
        });

        return pass();
    }

    return next();
});
