import { type ChatHistoryDocument, ChatHistoryModel } from '../../database/chatbot/HistorySchema';

/**
 * Retrieves the chat history for a guild.
 * If the chat history does not exist, it creates a new one.
 * @param guildId The ID of the guild.
 * @returns A promise that resolves to the chat history document.
 */
export async function getChatHistory(guildId: string): Promise<ChatHistoryDocument> {
    const chatHistory = await ChatHistoryModel.findOneAndUpdate(
        { guildId },
        {
            $setOnInsert: {
                guildId,
                history: []
            }
        },
        { new: true, upsert: true }
    );

    return chatHistory as ChatHistoryDocument;
}
