import { createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'voiceStateUpdate'
    },
    run: async ([state, oldState], client, shardId) => {
        if (!oldState?.channelId) return;

        // Leave voice channel if the bot is alone

        const channel = await client.channels.fetch(oldState.channelId);
        if (!channel.isVoice()) return;

        const members = await Promise.all((await channel.states()).map((x) => x.member()));
        const isVoiceChannelEmpty = members.filter(x => !x.user.bot).length === 0;

        if (isVoiceChannelEmpty) {
            const player = client.manager.getPlayer(channel.guildId!);
            if (!player) return;

            await player.destroy('Voice channel is empty.');
        }
    }
});
