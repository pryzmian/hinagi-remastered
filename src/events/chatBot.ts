import { EventContext, createEvent } from 'seyfert';
import { HarmCategory, HarmBlockThreshold, GoogleGenerativeAI, Content } from '@google/generative-ai';
import { ChatHistoryModel } from '../database/ChatBotHistory';
import { extractPrompt } from '../utils/functions/extractPrompt';

const getResponses = (username: string) => [
    `Hello ${username}, how can I help you today?`,
    `Hello ${username}, what can I do for you today?`,
    `Hello ${username}, how can I assist you today?`,
    `Hey ${username}, how you doing? How can I help you today?`
];

const getSafetySettings = () => [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE }
];

const chunkText = (text: string, size: number = 2000): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.substring(i, i + size));
    }
    return chunks;
};

export default createEvent({
    data: { name: 'messageCreate' },
    run: async (...[message, client]: EventContext<{ data: { name: 'messageCreate' } }>) => {
        if (!message.guildId || message.author.bot) return;

        const mentionRegex = new RegExp(`^<@!?${client.botId}>`);
        if (!mentionRegex.test(message.content)) return;
        
        const mentionMatch = message.content.match(mentionRegex);
        const userInput = mentionMatch ? extractPrompt(message.content, mentionMatch) : null;

        await client.channels.typing(message.channelId);

        if (!userInput?.length) {
            const responses = getResponses(message.author.toString());
            return message.reply({ content: responses[Math.floor(Math.random() * responses.length)] });
        }

        const chatHistory =
            (await ChatHistoryModel.findOne({ guildId: message.guildId })) ??
            (await ChatHistoryModel.create({ guildId: message.guildId, history: [] }));

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro', ...getSafetySettings() });

        const chat = model.startChat({
            history: chatHistory.history.map((line, index) => ({
                role: index % 2 === 0 ? 'user' : 'model',
                parts: [{ text: line.parts[0].text }]
            })) as Content[],
            generationConfig: { maxOutputTokens: 1000 }
        });

        const result = await chat.sendMessage(userInput);
        const text = await result.response.text();

        const botChatMessage: Content = { role: 'model', parts: [{ text }] };
        const userChatMessage: Content = { role: 'user', parts: [{ text: userInput }] };

        chatHistory.history.push(userChatMessage, botChatMessage);
        await chatHistory.save();

        for (const chunk of chunkText(text)) {
            await message.reply({ content: chunk });
        }
    }
});
