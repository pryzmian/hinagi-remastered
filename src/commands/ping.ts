import { MessageFlags } from 'discord-api-types/v10';
import { Command, Declare, type CommandContext } from 'seyfert';

@Declare({
    name: 'ping',
    description: 'Check the bot\'s latency',
    props: {
        usage: 'ping',
        examples: ['pong']
    },
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
export default class PingCommand extends Command {
    async run(ctx: CommandContext) {
        await ctx.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Pong! ${ctx.client.gateway.latency}ms`
        });
    }
}
