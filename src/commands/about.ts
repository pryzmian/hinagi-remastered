import { ActionRow, Button, Command, type CommandContext, Declare } from "seyfert";
import { ButtonStyle } from "seyfert/lib/types";
import { formatCpuUsage } from "../utils/functions/formatCpuUsage";
import { formatSeconds } from "../utils/functions/formatSeconds";

@Declare({
    name: "about",
    description: "Get information about the bot.",
    integrationTypes: ["GuildInstall"],
    contexts: ["Guild"],
})
export default class AboutCommand extends Command {
    async run(ctx: CommandContext) {
        const { client, interaction } = ctx;

        await interaction?.deferReply();

        // General information
        const activePlayers = client.manager.players.size ?? 0;
        const totalGuilds = client.cache.guilds?.count() ?? 0;
        const totalUsers = client.cache.users?.count() ?? 0;

        // System information
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
        const cpuUsage = formatCpuUsage();
        const uptime = formatSeconds(process.uptime());

        // Dependency versions
        const nodeVersion = process.versions.node;
        const seyfertVersion = "v2.0.0";
        const lavalinkVersion = "v4.0.7";

        const row = new ActionRow<Button>().addComponents(
            new Button().setLabel("Support Server").setStyle(ButtonStyle.Link).setURL("https://discord.gg/hEMYrjuVtd"),
            new Button()
                .setLabel("Invite Me")
                .setStyle(ButtonStyle.Link)
                .setURL(
                    "https://discord.com/oauth2/authorize?client_id=1104883303418445824&permissions=4298131712&integration_type=0&scope=applications.commands+bot",
                ),
            new Button().setLabel("Source Code").setStyle(ButtonStyle.Link).setURL("https://github.com/pryzmian/hinagi-remastered"),
        );

        await ctx.editOrReply({
            components: [row],
            embeds: [
                {
                    color: client.config.colors.info,
                    title: "About Me",
                    description: `Hi, I'm Hinagi, a music bot built using [Seyfert](https://www.seyfert.dev) and [Lavalink](https://lavalink.dev).`,
                    fields: [
                        {
                            name: "General Information",
                            value: `・Active Players: ${activePlayers}\n・Total Guilds: ${totalGuilds}\n・Total Users: ${totalUsers}`,
                        },
                        {
                            name: "System Information",
                            value: `・Memory Usage: ${memoryUsage.toFixed(2)} MB\n・CPU Usage: ${cpuUsage.toFixed(2)}%\n・Uptime: ${uptime}`,
                        },
                        {
                            name: "Dependency Versions",
                            value: `・Seyfert: ${seyfertVersion}\n・Node.js: v${nodeVersion}\n・Lavalink: ${lavalinkVersion}`,
                        },
                    ],
                },
            ],
        });
    }
}
