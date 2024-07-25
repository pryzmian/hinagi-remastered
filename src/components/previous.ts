import type { Track } from "lavalink-client/dist/types";
import type { ComponentContext } from "seyfert";
import { ComponentCommand, Middlewares } from "seyfert";

@Middlewares(["checkVoiceChannel", "checkQueueExists", "checkHistoryExists", "checkTrackExists"])
export default class PauseButton extends ComponentCommand {
    componentType = "Button" as const;

    filter(ctx: ComponentContext<typeof this.componentType>) {
        return ctx.customId === "previous-button";
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const { client, guildId } = ctx;
        const player = client.manager.getPlayer(guildId!);

        await ctx.interaction.deferUpdate();
        await player.queue.add(player.queue.previous.shift() as Track, 0);
    }
}
