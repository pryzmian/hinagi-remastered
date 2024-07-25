import { Command, type CommandContext, Declare, Options, createUserOption } from 'seyfert';

const options = {
    user: createUserOption({
        description: 'The user to show information for.',
        required: false
    })
};

@Declare({
    name: 'userinfo',
    description: 'Show information about a user.',
    aliases: ['user', 'whois'],
    integrationTypes: ['GuildInstall'],
    contexts: ['Guild']
})

@Options(options)
export default class UserInfoCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, author, options } = ctx;
        const { user } = options;
        
        const target = user ?? author;
        const member = await client.members.fetch(ctx.guildId as string, target.id);

        if (target) {
            await ctx.editOrReply({
                embeds: [
                    {
                        author: {
                            name: `${member.username}`,
                            url: member.avatarURL() ?? undefined
                        },
                        thumbnail: {
                            url: member.avatarURL() ?? undefined
                        },
                        description: `**ID**: ${member.id}\n**Tag**: ${member.tag}\n**Created**: ${member.createdAt.toUTCString()}`,
                        color: 0x007cff
                    }
                ]
            });
        } else {
            await ctx.editOrReply({
                embeds: [
                    {
                        author: {
                            name: `${author.username}`,
                            url: author.avatarURL() ?? undefined
                        },
                        thumbnail: {
                            url: author.avatarURL() ?? undefined
                        },
                        description: `**ID**: ${author.id}\n**Tag**: ${author.tag}\n**Created**: ${author.createdAt.toUTCString()}`,
                        color: 0x007cff
                    }
                ]
            });
        }
    }
}