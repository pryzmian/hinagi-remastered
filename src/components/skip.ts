import { MessageFlags } from 'discord-api-types/v10';
import type { ComponentContext } from 'seyfert';
import { ComponentCommand, Middlewares } from 'seyfert';

@Middlewares(['checkVoiceChannel', 'checkQueue'])
export default class SkipButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === 'skip-button';
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId, interaction } = ctx;

        const player = client.manager.getPlayer(guildId!);
        const messageId = player.get('messageId') ?? '';

        if (interaction.message.id !== messageId)
            return await ctx.interaction.editOrReply({
                flags: MessageFlags.Ephemeral,
                content: '❌ This track is no longer in the queue.'
            });

        if (player.paused)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                content: '❌ You need to resume the player first before skipping to the next track'
            });

        await ctx.interaction.deferUpdate();
        await player.skip(undefined, false);
    }
}