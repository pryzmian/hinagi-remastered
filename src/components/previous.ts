import type { ComponentContext } from 'seyfert';
import { ComponentCommand, Middlewares } from 'seyfert';
import type { Track } from 'lavalink-client/dist/types';
import { MessageFlags } from 'discord-api-types/v10';

@Middlewares(['checkVoiceChannel', 'checkQueue'])
export default class PauseButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === 'previous-button';
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {   
        const { client, guildId, interaction } = ctx;
        
        const player = client.manager.getPlayer(guildId!);
        const messageId = player.get('messageId') ?? "";

        if (interaction.message.id !== messageId) 
            return await ctx.interaction.editOrReply({
                flags: MessageFlags.Ephemeral,
                content: '❌ This track is no longer in the queue.'
            });
            
        if (!player.queue.previous.length) 
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                content: '❌ There are no previous tracks in the queue!'
            });
        
        await ctx.interaction.deferUpdate();
        await player.queue.add(player.queue.previous.shift() as Track, 0);
    }
}