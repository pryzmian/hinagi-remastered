import type { Content } from '@google/generative-ai';
import { Schema, model, type Document } from 'mongoose';

type ChatHistoryDocument = {
    guildId: string;
    history: Content[];
} & Document;

const ChatBotHistory = new Schema<ChatHistoryDocument>({
    guildId: { type: String, required: true, unique: true },
    history: [
        {
            role: { type: String, enum: ['user', 'model'] },
            parts: [{ text: { type: String } }]
        }
    ]
}, { timestamps: true });

const ChatHistoryModel = model<ChatHistoryDocument>('ChatBotHistory', ChatBotHistory);

export { ChatHistoryModel, type ChatHistoryDocument };
