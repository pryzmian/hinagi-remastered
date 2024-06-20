import { createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'voiceStateUpdate'
    },
    run: async ([state, oldState], client, shardId) => {
        if (!oldState?.channelId) return;

        // Leave voice channel when empty
        const player = client.manager.getPlayer(oldState.guildId);
        if (!player) return;

        const channel = await client.channels.fetch(player.voiceChannelId!);
        if (!channel.isVoice()) return;

        const members = await Promise.all((await channel.states()).map((x) => x.member()));
        const isVoiceChannelEmpty = members.filter(x => !x.user.bot).length === 0;

        if (isVoiceChannelEmpty) {
            client.logger.info(`Voice channel ${channel.id} is empty and the player is leaving.`);
            await player.destroy('Empty voice channel.', true);
        }
    }
});
