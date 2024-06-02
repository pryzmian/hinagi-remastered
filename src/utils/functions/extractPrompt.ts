import { Message } from "seyfert";

export function extractPrompt(messageContent: string, mentionMatch: RegExpMatchArray) {
    const args = messageContent.slice(mentionMatch[0].length).trim().split(/ +/g);
    return args.join(' ')?.toLowerCase();
}