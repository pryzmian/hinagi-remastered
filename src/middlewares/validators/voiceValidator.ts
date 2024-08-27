import { createMiddleware } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

export const checkVoiceChannel = createMiddleware<void>(async ({ context, next, pass }) => {
    const { member, client } = context;

    const voice = client.cache.voiceStates?.get(member?.id!, context.guildId!);
    const botChannel = await client.cache.voiceStates?.get(client.me?.id!, context.guildId!)?.channel();

    if (!voice) {
        await context.editOrReply({
            content: "❌ You need to be in a voice channel to use this command!",
            flags: MessageFlags.Ephemeral,
        });

        return pass();
    }

    if (botChannel && voice.channelId !== botChannel.id) {
        await context.editOrReply({
            content: `❌ You need to be in the same voice channel as me (${botChannel}) to use this command!`,
            flags: MessageFlags.Ephemeral,
        });

        return pass();
    }

    return next();
});
