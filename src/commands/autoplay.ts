import { Command, type CommandContext, Declare, Middlewares, Options, createBooleanOption } from "seyfert";

const options = {
    enabled: createBooleanOption({
        description: "Enable or disable the autoplay feature.",
        required: true,
    }),
};

@Declare({
    name: "autoplay",
    description: "Activate or deactivate the autoplay feature.",
    aliases: ["ap"],
    props: {
        usage: "autoplay <true | false | yes | no>",
        examples: ["autoplay true/false", "autoplay yes/no"],
    },
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueNotPlaying", "checkAutoplayRequirements"])
export default class AutoplayCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, guildId } = ctx;
        const { enabled } = options;

        const player = client.manager.getPlayer(guildId!);

        player.set("enabledAutoplay", enabled);

        await ctx.editOrReply({ content: `The autoplay feature has been ${enabled ? "enabled" : "disabled"}.` });
    }
}
