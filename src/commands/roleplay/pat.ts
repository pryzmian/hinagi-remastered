import { Command, type CommandContext, Declare, Options, createUserOption } from "seyfert";
import { NekoImageType, getNeko } from "../../utils/functions/nekos";

const options = {
    user: createUserOption({
        description: "The user to pat.",
        required: true,
    }),
};

@Declare({
    name: "pat",
    description: "Pat someone!",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
export default class PatCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, author, guildId, options } = ctx;
        const { user } = options;

        const image = await getNeko(NekoImageType.Pat);

        const member = await client.members.fetch(guildId!, user.id);
        if (!member)
            return ctx.editOrReply({
                embeds: [
                    {
                        color: client.config.colors.success,
                        description: `**${author.toString()}** I couldn't find that user. Sorry :(`,
                    },
                ],
            });

        return ctx.editOrReply({
            embeds: [
                {
                    color: client.config.colors.success,
                    description: `**${author.toString()}** patted **${member.toString()}**!`,
                    image: {
                        url: `${image.url}`,
                    },
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
