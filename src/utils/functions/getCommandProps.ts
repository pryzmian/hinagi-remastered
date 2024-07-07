import type { CommandContext } from "seyfert";
import type { CommandProps } from "../types";

/**
 * Retrieves the command properties and returns a formatted string with the usage and examples.
 * @param context - The command context.
 * @returns A string with the formatted command properties.
 */
export default function getCommandProps(context: CommandContext): string {
    const { command } = context;
    const { props } = command;

    if (!props) throw new Error(`The command ${command.name} does not have any extra properties.`);

    const { usage, examples } = props as CommandProps;

    if (!Array.isArray(examples)) throw new Error(`The examples property in '${command.name}' must be an array.`);
    if (typeof usage !== 'string') throw new Error(`The usage property in '${command.name}' must be a string.`);
    if (!(usage || examples.length)) throw new Error(`The command '${command.name}' does not have a valid usage or examples property.`);

    return `**Usage:** ${usage}\n**Examples:**\n${examples.map((example) => `・${example}`).join('\n')}`;
}