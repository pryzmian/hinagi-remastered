import { Lavalink } from '../../structures/Lavalink';

import type { CommandContext, User } from 'seyfert';
import { ActionRow, Button, Embed } from 'seyfert';
import { ButtonStyle } from 'discord-api-types/v10';

export default new Lavalink({
    name: 'trackStart',
    type: 'manager',
    run: async (client, player, track) => {
        if (!player.textChannelId) return;
        
        const ctx = player.get<CommandContext>('commandContext');

        const me = ctx.me();
        if (!me) return;

        const permissions = await client.channels.memberPermissions(player.textChannelId, me);
        if (!permissions.has(['SendMessages', 'ViewChannel'])) return client.logger.error('playerStart listener: Missing permissions to send messages or view channel.');

        const row = new ActionRow<Button>().addComponents(
            new Button().setCustomId('previous-button').setEmoji(client.config.emojis.previous).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId('pause-button').setEmoji(client.config.emojis.pause).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId('skip-button').setEmoji(client.config.emojis.next).setStyle(ButtonStyle.Secondary),
            new Button().setCustomId('queue-button').setEmoji(client.config.emojis.queue).setStyle(ButtonStyle.Primary)
        );

        const embed = new Embed()
            .setColor(client.config.color)
            .setAuthor({
                name: (track.requester as User).tag || 'Unknown User',
                iconUrl: (track.requester as User).avatarURL() 
            })
            .setDescription(`**Now playing ♪**\n[**${track.info.title}**](${track.info.uri})`)
            .setThumbnail(track.info.artworkUrl ?? '');

        const message = await client.messages.write(player.textChannelId, { embeds: [embed], components: [row] }).catch(() => null);
        if (message) player.set('messageId', message.id);
    }
});