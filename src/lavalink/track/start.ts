import { Lavalink } from "../../structures/Lavalink";

import { APIEmbedThumbnail, ButtonStyle } from "discord-api-types/v10";
import type { CommandContext, User } from "seyfert";
import { ActionRow, Button, Embed } from "seyfert";

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
                author: {
                    name: (track.requester as User).username ?? "",
                    icon_url: (track.requester as User).avatarURL() ?? null
                },
                description: `**Now playing ♪**\n[**${track.info.title}**](${track.info.uri})`,
                thumbnail: {
                    url: track.info.artworkUrl ?? ""
                }
            }]
        }).catch(() => null);
        
        if (message) player.set("messageId", message.id);
    },
});
