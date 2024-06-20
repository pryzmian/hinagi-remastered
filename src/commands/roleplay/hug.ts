import { Command, CommandContext, Declare, Options, createUserOption } from 'seyfert';
import NekosClient from 'nekos.life';

const options = {
    user: createUserOption({
        description: 'The user to hug.',
        required: true
    })
};

@Declare({
    name: 'hug',
    description: 'Hug someone!',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class HugCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, author, guildId, options } = ctx;
        const { user } = options;

        const nekoClient = new NekosClient();

        const member = await client.members.fetch(guildId!, user.id);
        if (!member)
            return ctx.editOrReply({
                embeds: [
                    {
                        color: client.config.color,
                        description: `**${author.toString()}** I couldn't find that user. But I can give you a hug!`,
                        image: {
                            url: `${(await nekoClient.hug()).url}`
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            });

        return ctx.editOrReply({
            embeds: [
                {
                    color: client.config.color,
                    description: `**${author.toString()}** gave **${member.toString()}** a hug!`,
                    image: {
                        url: `${(await nekoClient.hug()).url}`
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        });
    }
}
