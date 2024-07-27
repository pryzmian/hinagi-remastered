import { createMiddleware, type PermissionStrings } from "seyfert";

export const checkVoiceChannel = createMiddleware<void>(async ({ context, next, stop }) => {
    const { client, member } = context;
    const me = context.me();

    if (!(member && me)) return;

    const requiredPermissions = ["Connect", "Speak", "ViewChannel"];

    const voice = member.voice();
    const botVoice = me?.voice();

    if (!voice) return stop("You need to be in a voice channel to manage music");
    if (botVoice && botVoice.channelId !== voice.channelId) return stop("You need to be in my same channel to manage music");

    const voiceChannel = await voice?.channel();

    if (voiceChannel?.isStage()) requiredPermissions.push("MoveMembers");

    const permissions = await client.channels.memberPermissions(voice?.channelId!, me!);
    const missings = permissions.keys(permissions.missings(requiredPermissions as PermissionStrings));

    if (missings.length) return stop(`I am missing one of the following permissions to manage music: ${missings.join(", ")}`);

    return next();
});
