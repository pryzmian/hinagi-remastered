import { MessageFlags } from 'discord-api-types/v10';
import { Command, CommandContext, Declare, Options, createIntegerOption } from 'seyfert';
import { EmbedColors } from 'seyfert/lib/common';

const options = {
    position: createIntegerOption({
        description: 'The position of the song to skip to.'
    })
};

@Declare({
    name: 'skip',
    description: 'Skips the current song.',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class ExampleCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member } = ctx;
        const { position } = options;

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
                        description: 'There are no tracks currently playing and no tracks in the queue, try adding some tracks!',
                        color: client.config.color
                    }
                ]
            });

        if (position && position > player.queue.tracks.length)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: `There is no song at position ${position} to skip to!`,
                        color: client.config.color
                    }
                ]
            });

        if (!player.queue.current)
            return ctx.editOrReply({
                flags: MessageFlags.Ephemeral,
                embeds: [
                    {
                        description: 'There is no song currently playing you can skip!',
                        color: client.config.color
                    }
                ]
            });

        if (position) {
            await player.skip(position);
            await ctx.editOrReply({ embeds: [{ description: `Skipped **${position}* tracks*!`, color: EmbedColors.Green }] });
        } else {
            await player.skip();
            await ctx.editOrReply({ embeds: [{ description: 'Skipped the current song!', color: EmbedColors.Green }] });
        }
    }
}