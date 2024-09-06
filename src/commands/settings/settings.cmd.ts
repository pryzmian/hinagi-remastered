import { AutoLoad, Command, Declare } from "seyfert";

@Declare({
    name: "settings",
    description: "Manage the settings for the bot in this server.",
    integrationTypes: ["GuildInstall"],
    guildId: ["1213361742571241492"],
    contexts: ["Guild"],
})
@AutoLoad()
export default class SettingsCommand extends Command {}
