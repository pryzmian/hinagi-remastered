import { Lavalink } from "../../structures/Lavalink";

import { ButtonStyle } from "seyfert/lib/types";
import type { CommandContext, User } from "seyfert";
import { ActionRow, Button } from "seyfert";
import { parseTime } from "../../utils/functions/parseTime";

export default new Lavalink({
    name: "trackStart",
    type: "manager",
    run: async (client, player, track) => {
        if (!player.textChannelId) return;

        const ctx = player.get<CommandContext>("commandContext");

        const me = ctx.me();
        if (!me) return;

        const permissions = await client.channels.memberPermissions(player.textChannelId, me);
        if (!permissions.has(["SendMessages", "ViewChannel"]))
            return client.logger.error("playerStart listener: Missing permissions to send messages or view channel.");

        const row = new ActionRow<Button>().addComponents(
            new Button().setCustomId("previous-button").setEmoji(client.config.emojis.previous).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId("pause-button").setEmoji(client.config.emojis.pause).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId("skip-button").setEmoji(client.config.emojis.next).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId("queue-button").setEmoji(client.config.emojis.queue).setStyle(ButtonStyle.Primary),
        );

        const message = await client.messages.write(player.textChannelId, {
            components: [row],
            embeds: [{
                color: client.config.colors.success,
                title: "Now playing",
                description: `${client.config.emojis.playing} [**${track.info.title}**](${track.info.uri})\n**Duration:** ${track.info.isStream ? "\`🔴 Live Stream\`" : `\`${parseTime(track.info.duration) }\``}\n**Requested by:** ${track.requester}`,
                thumbnail: { url: track.info.artworkUrl ?? "" }
            }]
        }).catch(() => null);

        if (message) player.set("messageId", message.id);
    },
});
