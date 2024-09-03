//@ts-check

const { GatewayIntentBits } = require("seyfert/lib/types");
const { config } = require("seyfert");

const isWindows = process.platform === "win32";
const isDev = process.argv.includes("--dev");

const output = isWindows && isDev ? "src" : "dist";

module.exports = config.bot({
    debug: true,
    token: process.env.DISCORD_BOT_TOKEN ?? "",
    applicationId: process.env.DISCORD_APPLICATION_ID ?? "",
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    locations: {
        output,
        base: "src",
        events: "events",
        commands: "commands",
        components: "components",
    },
});
