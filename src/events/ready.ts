import { createEvent } from "seyfert";

export default createEvent({
    data: { name: "botReady", once: true },
    run: async (user, client) => {
        client.logger.info(`Logged in as: ${user.tag}`);

        await client.manager.init({ id: user.id, username: user.username });
        await client.database.connect();
    },
});
