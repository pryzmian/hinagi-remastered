import { type CommandContext, createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'voiceStateUpdate'
    },
    run: async ([newState, oldState], client, _shardId) => {
        if (oldState?.channelId === newState.channelId) return;
        if (newState.channelId === null) return;

        const { guildId } = newState;
        const stateChannel = await client.channels.fetch(newState.channelId as string);

        if (!stateChannel.is(['GuildVoice', 'GuildStageVoice'])) return;

        // Check if voice channel is empty
        const members = await Promise.all((await stateChannel.states()).map((x) => x.member()));
        const isEmpty = members.filter((x) => !x.user.bot).length === 0;

        const player = client.manager.getPlayer(guildId);
        if (!player) return;
        
        const ctx = player.get<CommandContext>('commandContext');
        
        if (isEmpty) {
            await player.destroy('Empty voice channel.', true);
        }

        if (stateChannel.isStage() && ctx.me()?.voice()?.suppress) {
            await ctx.me()?.voice()?.setSuppress(false);
        }
    }
});
