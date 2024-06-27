import type { ComponentContext } from 'seyfert';
import { ComponentCommand, Middlewares } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types';

@Middlewares(['checkVoiceChannel', 'checkQueue'])
export default class PauseButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === 'pause-button';
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

        if (player.paused) await player.resume();
        else if (player.playing) await player.pause();

        await ctx.interaction.deferUpdate();
    }
}