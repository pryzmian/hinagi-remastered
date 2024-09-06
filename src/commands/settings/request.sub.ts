import { type CommandContext, Declare, Options, SubCommand, createChannelOption } from "seyfert";
import { ChannelType } from "seyfert/lib/types";

const options = {
    channel: createChannelOption({
        description: "The channel to set for the bot.",
        required: true,
        channel_types: [ChannelType.GuildText],
    }),
};

@Declare({
    name: "request-channel",
    description: "Set the song request channel for the bot in this server.",
})
@Options(options)
export default class PrefixCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { channel } = options;

        const me = ctx.me();
        if (!me) return;

        await ctx.deferReply();

        const guildChannel = await client.channels.fetch(channel.id);
        const permissions = await client.channels.memberPermissions(guildChannel.id, me);
        const missings = permissions.keys(permissions.missings(["SendMessages", "ViewChannel"]));

        if (!guildChannel) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: client.config.colors.error,
                        description: `${client.config.emojis.error} The channel could not be found. Make sure the channel exists and I have access to it.`,
                    },
                ],
            });
        }

        if (missings.length) {
            return ctx.editOrReply({
                embeds: [
                    {
                        color: client.config.colors.error,
                        description: `${client.config.emojis.error} I am missing the following permissions in <#${guildChannel.id}>: \`${missings.join(", ")}\``,
                    },
                ],
            });
        }

        await client.database.setRequestChannel(ctx.guildId!, channel.id);

        await ctx.editOrReply({
            embeds: [
                {
                    color: client.config.colors.success,
                    description: `${client.config.emojis.success} The song request channel has been set to <#${channel.id}>.`,
                },
            ],
        });
    }
}
