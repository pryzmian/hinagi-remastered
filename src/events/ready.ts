import { createEvent } from 'seyfert';
import { connectToDatabase } from '../database';

export default createEvent({
    data: { name: 'botReady', once: true },
    run: async (user, client) => {
        client.logger.info(`Logged in as: ${user.tag}`);

        await client.manager.init({ id: user.id, username: user.username });
        await connectToDatabase(client);
    }
});
