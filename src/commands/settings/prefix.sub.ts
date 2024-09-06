import { type CommandContext, Declare, Options, SubCommand, createStringOption } from "seyfert";

const options = {
    prefix: createStringOption({
        description: "The prefix to set for the bot.",
        min_length: 1,
        required: true,
    }),
};

@Declare({
    name: "prefix",
    description: "Set the prefix for the bot in this server.",
})
@Options(options)
export default class PrefixCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { prefix } = options;

        await ctx.deferReply();

        // No :3
        /* if (prefix.length > 2) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: client.config.colors.error,
                        description: `${client.config.emojis.error} The prefix must be 2 characters or less.`,
                    },
                ],
            });
        } */

        await client.database.setPrefix(ctx.guildId!, prefix);

        await ctx.editOrReply({
            embeds: [
                {
                    color: client.config.colors.success,
                    description: `${client.config.emojis.success} The prefix has been set to \`${prefix}\`.`,
                },
            ],
        });
    }
}
