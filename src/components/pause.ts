import type { ComponentContext } from "seyfert";
import { ComponentCommand, Middlewares } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkTrackExists"])
export default class PauseButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "pause-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        if (player.paused) await player.resume();
        else if (player.playing) await player.pause();

        await ctx.interaction.deferUpdate();
    }
}
