import { SubCommand, type CommandContext, Declare, Middlewares, Options, createIntegerOption } from "seyfert";

const options = {
    volume: createIntegerOption({
        description: "The volume to set the player to.",
        required: true,
        min_value: 1,
        max_value: 100,
    }),
};

@Declare({
    name: "volume",
    description: "Sets the volume of the player.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
@Options(options)
@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueEmpty"])
export default class VolumeCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        const { client, options } = ctx;
        const { volume } = options;

        const player = client.manager.getPlayer(ctx.guildId!);
        let response = `The volume has been set to \`${volume}\`.`;

        if (volume === 1) {
            await player.setVolume(volume).then(async () => await player.pause());

            response += "\nBecause of this, the player has been paused.";
        } else if (volume > 1 && player.paused) {
            await player.resume();
            await player.setVolume(volume);
        }

        await player.setVolume(volume);
        await ctx.editOrReply({
            content: response,
        });
    }
}
