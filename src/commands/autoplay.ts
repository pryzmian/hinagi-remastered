import { MessageFlags } from 'discord-api-types/v10';
import { Command, Declare, createBooleanOption, Options, CommandContext } from 'seyfert';

const options = {
    enabled: createBooleanOption({
        description: 'Enable or disable the autoplay feature.',
        required: true
    })
};

@Declare({
    name: 'autoplay',
    description: 'Activate or deactivate the autoplay feature.',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class AutoplayCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, member } = ctx;
        const { enabled } = options;

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

        player.set('enabledAutoplay', enabled);

        await ctx.editOrReply({ content: `The autoplay feature has been ${enabled ? 'enabled' : 'disabled'}.` });
    }
}