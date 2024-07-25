/**
 * Extracts the prompt from the message content by removing the mention and converting it to lowercase.
 * @param messageContent - The content of the message.
 * @param mentionMatch - The matched mention in the message content.
 * @returns The extracted prompt in lowercase.
 */
export default function extractPrompt(messageContent: string, mentionMatch: RegExpMatchArray) {
    const args = messageContent.slice(mentionMatch[0].length).trim().split(/ +/g);
    return args.join(" ")?.toLowerCase();
}
