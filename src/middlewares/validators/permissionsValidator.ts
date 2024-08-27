import { MessageFlags } from "seyfert/lib/types";
import { createMiddleware } from "seyfert";

export const checkPermissions = createMiddleware<void>(async ({ context, next, pass }) => {
    const { client, member } = context;

    const me = context.me();
    if (!me) return;

    const voice = await client.cache.voiceStates?.get(member?.id!, context.guildId!)?.channel();

    const permissions = await client.channels.memberPermissions(voice?.id!, me);
    const missings = permissions.keys(permissions.missings(["Connect", "Speak", "ViewChannel"]));

    if (missings.length) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            embeds: [{
                color: client.config.colors.error,
                description: `${client.config.emojis.error} I am missing the following permissions to play music in <#${voice?.id}>: ${missings.join(", ")}`
            }]
        });

        return pass();
    }

    return next();
});
