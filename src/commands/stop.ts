import { MessageFlags } from 'discord-api-types/v10';
import { Command, CommandContext, Declare } from 'seyfert';
import { EmbedColors } from 'seyfert/lib/common';

@Declare({
    name: 'stop',
    description: 'Stops the current queue.',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
export default class ExampleCommand extends Command {
    async run(ctx: CommandContext) {
        const { client, options, member } = ctx;

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

        await player.destroy();
        await ctx.editOrReply({ embeds: [{ description: 'Stopped the queue!', color: EmbedColors.Green }] });
    }
}