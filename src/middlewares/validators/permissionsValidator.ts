import { MessageFlags } from "discord-api-types/v10";
import { createMiddleware } from "seyfert";

export const checkPermissions = createMiddleware<void>(async ({ context, next, pass }) => {
    const { client, member } = context;

    const me = context.me();
    if (!me) return;

    const voice = member?.voice();
    const bot = client.cache.voiceStates?.get(client.me?.id!, context.guildId!);

    const permissions = await client.channels.memberPermissions(voice?.channelId!, me);
    const missings = permissions.keys(permissions.missings(["Connect", "Speak", "ViewChannel", "MoveMembers"]));

    if (missings.length) {
        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `❌ I am missing the following permissions to play music in ${await bot?.channel()}: ${missings.join(", ")}`,
        });

        return pass();
    }

    return next();
});
