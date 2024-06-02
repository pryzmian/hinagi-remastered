import { EventContext, createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'messageCreate'
    },
    run: async (...[message, client]: EventContext<{ data: { name: 'messageCreate' } }>) => {
        if (!message.guildId || message.author.bot) return;

        const mentionRegex = new RegExp(`^<@!?${client.botId}>`);
        if (mentionRegex.test(message.content) || message.referencedMessage?.author.id === client.botId) {
            await message.reply({ content: 'Hello' });
        }
    }
});