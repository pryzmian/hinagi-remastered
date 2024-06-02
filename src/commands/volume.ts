import { MessageFlags } from 'discord-api-types/v10';
import { Command, CommandContext, Declare, Options, createIntegerOption } from 'seyfert';
import { EmbedColors } from 'seyfert/lib/common';

const options = {
    volume: createIntegerOption({
        description: 'The volume to set the player to.',
        required: true,
        min_value: 1,
        max_value: 100
    })
};

@Declare({
    name: 'volume',
    description: 'Sets the volume of the player.',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class VolumeCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member } = ctx;
        const { volume } = options;

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

        if (volume === 1) {
            await player.pause();
            await ctx.editOrReply({
                embeds: [{
                    description: 'The volume has been set to 1. Because of this, the player has been paused.',
                    color: EmbedColors.Green
                }]
            });
        } else if (volume > 1 && player.paused) {
            await player.resume();
            await ctx.editOrReply({
                embeds: [{
                    description: `The volume has been set to ${volume}.`,
                    color: EmbedColors.Green
                }]
            });
        }

        await player.setVolume(volume);
        await ctx.editOrReply({
            embeds: [{
                description: `The volume has been set to ${volume}.`,
                color: EmbedColors.Green
            }]
        });
    }
}