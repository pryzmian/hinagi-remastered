import { type CommandContext, createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'voiceStateUpdate'
    },
    run: async ([newState, oldState], client) => {
        if (oldState?.channelId === newState.channelId) return;
        if (newState.channelId === null) return;
        
        const { guildId } = newState;
        const player = client.manager.getPlayer(guildId);
        if (!player) return;

        const stateChannel = await client.channels.fetch(player.voiceChannelId!);

        if (!stateChannel.is(['GuildVoice', 'GuildStageVoice'])) return;

        // Check if voice channel is empty
        const members = await Promise.all((await stateChannel.states()).map((x) => x.member()));
        const isEmpty = members.filter((x) => !x.user.bot).length === 0;
                
        if (isEmpty) {
            await player.destroy('Empty voice channel.', true);
        }
    }
});
