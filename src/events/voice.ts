import { createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'voiceStateUpdate'
    },
    run: async ([newState, oldState], client, _shardId) => {
        
        const { channelId, guildId } = newState || oldState;
        const stateChannel = await client.channels.fetch(channelId as string);

        if (!stateChannel.is(['GuildVoice', 'GuildStageVoice'])) return;

        // Check if voice channel is empty
        const members = await Promise.all((await stateChannel.states()).map((x) => x.member()));
        const isVoiceChannelEmpty = members.filter((x) => !x.user.bot).length === 0;
        const player = client.manager.getPlayer(guildId);

        if (player && isVoiceChannelEmpty) {
            await player.destroy('Empty voice channel.', true);
        }
    }
});
