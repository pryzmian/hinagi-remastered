import { createEvent } from 'seyfert';
import { HarmCategory, HarmBlockThreshold, GoogleGenerativeAI, type Content, type Part } from '@google/generative-ai';
import { extractPrompt } from '../utils/functions/extractPrompt';
import { getChatHistory } from '../utils/functions/getChatHistory';

const getResponses = (username: string) => [
    `Hello ${username}, how can I help you today?`,
    `Hello ${username}, what can I do for you today?`,
    `Hello ${username}, how can I assist you today?`,
    `Hey ${username}, how you doing? How can I help you today?`
];

const chunkText = (text: string, size: number): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.substring(i, i + size));
    }
    return chunks;
};

export default createEvent({
    data: { name: 'messageCreate' },
    run: async (message, client) => {
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

        const chatHistory = await getChatHistory(message.guildId);

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_UNSPECIFIED, threshold: HarmBlockThreshold.BLOCK_NONE }
            ]
        });

        const chat = model.startChat({
            history: chatHistory.history?.map(
                (chat) =>
                    ({
                        role: chat.role,
                        parts: chat.parts.map((part) => ({ text: part.text }))
                    }) as Content
            ),
            generationConfig: { maxOutputTokens: 1000 }
        });

        const result = await chat.sendMessage(userInput);
        const text = result.response.text();

        if (!text.length) {
            return message.reply({ content: "I'm sorry, I did\'nt quite get that, could you try again?" })
        }

        chatHistory.history.push(
            { role: 'user', parts: [{ text: userInput }] as Part[] },
            { role: 'model', parts: [{ text }] as Part[] }
        );
        await chatHistory.save();

        for (const chunk of chunkText(text, 2000)) {
            await message.reply({ content: chunk });
        }
    }
});
