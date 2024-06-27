import { Command, Declare, createBooleanOption, Options, type CommandContext, Middlewares } from 'seyfert';

const options = {
    enabled: createBooleanOption({
        description: 'Enable or disable the autoplay feature.',
        required: true
    })
};

@Declare({
    name: 'autoplay',
    description: 'Activate or deactivate the autoplay feature.',
    aliases: ['ap'],
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
@Middlewares(['checkVoiceChannel', 'checkQueue'])
export default class AutoplayCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, guildId } = ctx;
        const { enabled } = options;

        const player = client.manager.getPlayer(guildId!);

        if (player.queue.tracks.length >= 2)
            return ctx.editOrReply({ content: '❌ Two or more tracks are required for this feature to work' });

        player.set('enabledAutoplay', enabled);

        await ctx.editOrReply({ content: `The autoplay feature has been ${enabled ? 'enabled' : 'disabled'}.` });
    }
}