import { MessageFlags } from "discord-api-types/v10";
import { createMiddleware } from "seyfert";

export const checkVoiceChannel = createMiddleware<void>(async ({ context, next, pass }) => {
    const { member, me } = context;

    if (!me) return;
    
    const voice = member?.voice();
    const bot = context.me()?.voice();

    if (!voice) {
        await context.editOrReply({
            content: '❌ You need to be in a voice channel to use this command!',
            flags: MessageFlags.Ephemeral
        });

        return pass()
    }

    if (bot && voice && voice.channelId !== bot.channelId) {
        await context.editOrReply({
            content: `❌ You need to be in the same voice channel as me (${await bot.channel()}) to use this command!`,
            flags: MessageFlags.Ephemeral
        });

        return pass()
    }

    return next();
})