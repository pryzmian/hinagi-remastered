import { Command, type CommandContext, Declare, Options, createStringOption } from 'seyfert';
import type { RepeatMode } from 'lavalink-client';
import { MessageFlags } from 'discord-api-types/v10';
import { EmbedColors } from 'seyfert/lib/common';

const options = {
    mode: createStringOption({
        description: 'The repeat mode to set.',
        required: true,
        choices: [
            { name: 'Track', value: 'track' },
            { name: 'Queue', value: 'queue' },
            { name: 'Off', value: 'off' }
        ]
    })
};

@Declare({
    name: 'repeat',
    description: 'Change the repeat mode of the current queue.',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class RepeatCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member } = ctx;
        const { mode } = options;

        const me = ctx.me();
        if (!me) return;

        const voice = member?.voice();
        const bot = me.voice();

        const repeatType: Record<RepeatMode, string> = {
            off: 'Off',
            queue: 'Queue',
            track: 'Track'
        };

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

        const player = client.manager.getPlayer(ctx.guildId as string);
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

        await player.setRepeatMode(mode as RepeatMode);
        await ctx.editOrReply({
            embeds: [{
                description: `The repeat mode has been set to \`${repeatType[mode as RepeatMode]}\`!`,
                color: EmbedColors.Green
            }]
        });

    }
}