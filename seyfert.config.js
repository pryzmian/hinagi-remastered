const { GatewayIntentBits } = require("discord-api-types/v10");
const { config } = require("seyfert");

module.exports = config.bot({
    token: process.env.DISCORD_BOT_TOKEN ?? "",
    applicationId: process.env.DISCORD_APPLICATION_ID ?? "",
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    locations: {
        base: "src",
        output: "dist",
        events: "events",
        commands: "commands",
        components: "components",
    },
    debug: false,
});
