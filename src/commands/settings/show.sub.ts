import { type CommandContext, Declare, SubCommand } from "seyfert";

@Declare({
    name: "show",
    description: "Shows the settings for the bot.",
})
export default class ShowCommand extends SubCommand {
    async run(ctx: CommandContext) {
        const { client } = ctx;

        await ctx.deferReply();

        const prefix = await client.database.getPrefix(ctx.guildId!);
        const language = await client.database.getLanguage(ctx.guildId!);
        const requestChannel = await client.database.getRequestChannel(ctx.guildId!);

        await ctx.editOrReply({
            embeds: [
                {
                    color: client.config.colors.info,
                    title: "Showing settings for this guild",
                    description: `・Prefix: \`${prefix}\`\n・Language: \`${language}\`\n・Request Channel: ${requestChannel ? `<#${requestChannel}>` : "`Not set`"}`,
                    timestamp: new Date().toISOString(),
                },
            ],
        });
    }
}
