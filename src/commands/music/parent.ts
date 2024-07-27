import { MessageFlags } from "discord-api-types/v10";
import { Declare, Command, AutoLoad, type CommandContext } from "seyfert";

@Declare({
    name: "music",
    description: "music commands",
})
@AutoLoad()
export default class MusicParent extends Command {
    async onMiddlewaresError(context: CommandContext, error: string) {
        return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `❌ ${error}`,
        });
    }
}
