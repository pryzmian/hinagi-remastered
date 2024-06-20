import { MessageFlags } from 'discord-api-types/v10';
import type { ComponentContext } from 'seyfert';
import { ComponentCommand } from 'seyfert';

export default class SkipButton extends ComponentCommand {
    componentType = 'Button' as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === 'skip-button';
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, member } = ctx;

        const me = ctx.me();
        if (!me) return;

        const voice = member?.voice();
        const bot = me.voice();

        if (!voice)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'You need to be in a voice channel to play music!',
                        color: client.config.color
                    }
                ]
            });

        if (bot && voice.channelId !== bot.channelId)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'You need to be in the same voice channel as me to play music!',
                        color: client.config.color
                    }
                ]
            });

        const player = client.manager.getPlayer(ctx.guildId!);
        
        if (!player)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'There are no tracks currently playing and no tracks in the queue, try adding some tracks!',
                        color: client.config.color
                    }
                ]
            });
        
        const isAutoplayEnabled = player.get<boolean>('enabledAutoplay');

        if (isAutoplayEnabled)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'Autoplay is enabled, you cannot skip tracks when autoplay is enabled!',
                        color: client.config.color
                    }
                ]
            });

        if (!player.queue.tracks.length)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'There are no tracks in the queue to skip!',
                        color: client.config.color
                    }
                ]
            });

        if (!player.playing && player.paused)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'You need to resume the player first before skipping to the next track',
                        color: client.config.color
                    }
                ]
            });

        await ctx.interaction.deferUpdate();
        await player.skip();
    }
}