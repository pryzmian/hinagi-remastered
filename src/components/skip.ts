import type { ComponentContext } from "seyfert";
import { ComponentCommand, Middlewares } from "seyfert";

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkQueueNotPlaying", "checkTrackExists"])
export default class SkipButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "skip-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        await ctx.interaction.deferUpdate();
        await player.skip(undefined, false);
    }
}
