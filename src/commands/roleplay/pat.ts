import { Command, CommandContext, Declare, Options, createUserOption } from 'seyfert';
import NekosClient from 'nekos.life';

const options = {
    user: createUserOption({
        description: 'The user to pat.',
        required: true
    })
};

@Declare({
    name: 'pat',
    description: 'Pat someone!',
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})
@Options(options)
export default class PatCommand extends Command {
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
                        description: `**${author.toString()}** I couldn't find that user. Sorry :(`,
                    }
                ]
            });

        return ctx.editOrReply({
            embeds: [
                {
                    color: client.config.color,
                    description: `**${author.toString()}** patted **${member.toString()}**!`,
                    image: {
                        url: `${(await nekoClient.pat()).url}`
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        });
    }
}
