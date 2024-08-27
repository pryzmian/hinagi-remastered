import { Command, type CommandContext, Declare, Middlewares, Options, createBooleanOption } from "seyfert";

const options = {
    toggle: createBooleanOption({
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
        examples: ["autoplay true", "autoplay no"],
    },
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueNotPlaying", "checkAutoplayRequirements"])
export default class AutoplayCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options, guildId } = ctx;
        const { toggle } = options;

        const player = client.manager.getPlayer(guildId!);
        player.set("enabledAutoplay", toggle);

        await ctx.write({
            embeds: [{
                color: client.config.colors.success,
                description: `${client.config.emojis.success} Autoplay has been ${toggle ? "enabled" : "disabled"}.`,
            }]
        });
    }
}
