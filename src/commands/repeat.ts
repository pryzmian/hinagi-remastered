import type { RepeatMode } from "lavalink-client";
import { Command, type CommandContext, Declare, Middlewares, Options, createStringOption } from "seyfert";

const options = {
    mode: createStringOption({
        description: "The repeat mode to set.",
        required: true,
        choices: [
            { name: "Track", value: "track" },
            { name: "Queue", value: "queue" },
            { name: "Off", value: "off" },
        ],
    }),
};

@Declare({
    name: "repeat",
    description: "Change the repeat mode of the current queue.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueEmpty", "checkTrackExists"])
export default class RepeatCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { mode } = options;

        const repeatType: Record<RepeatMode, string> = {
            off: "Off",
            queue: "Queue",
            track: "Track",
        };

        const player = client.manager.getPlayer(ctx.guildId!);

        await player.setRepeatMode(mode as RepeatMode);
        await ctx.write({
            embeds: [{
                color: client.config.colors.success,
                description: `${client.config.emojis.success} Repeat mode set to ${repeatType[mode as RepeatMode]}`,
            }],
        });
    }
}
