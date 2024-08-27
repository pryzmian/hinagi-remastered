import NekosClient from "nekos.life";
import { Command, type CommandContext, Declare, Options, createUserOption } from "seyfert";

const options = {
    user: createUserOption({
        description: "The user to kiss.",
        required: true,
    }),
};

@Declare({
    name: "kiss",
    description: "Kiss someone!",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})

@Options(options)
export default class KissCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, author, guildId, options } = ctx;
        const { user } = options;

        const nekoClient = new NekosClient();

        const member = await client.members.fetch(guildId!, user.id);
        if (!member)
            return ctx.editOrReply({
                embeds: [{
                    color: client.config.colors.success,
                    description: `**${author.toString()}** I couldn't find that user. Sorry :(`,
                }],
            });

        if (member.id === client.botId)
            return ctx.editOrReply({
                embeds: [{
                    color: client.config.colors.success,
                    description: `**${author.toString()}** You can't kiss me! 😳`,
                }],
            });

        if (member.id === author.id)
            return ctx.editOrReply({
                embeds: [{
                    color: client.config.colors.success,
                    description: `**${author.toString()}** You can't kiss yourself! 😳`,
                }],
            });

        return ctx.editOrReply({
            embeds: [{
                color: client.config.colors.success,
                description: `**${author.toString()}** kissed **${member.toString()}**!`,
                image: {
                    url: `${(await nekoClient.kiss()).url}`,
                },
                timestamp: new Date().toISOString(),
            }],
        });
    }
}
