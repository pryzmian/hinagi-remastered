import type { Mongoose} from 'mongoose';
import { connect } from 'mongoose';
import type { UsingClient } from 'seyfert';

export async function connectToDatabase(client: UsingClient): Promise<Mongoose | undefined> {
    try {
        client.logger.info('Successfully connected to the database');
        return await connect(process.env.DATABASE_URI!, {
            dbName: 'nikobot'
        });
    } catch (error) {
        client.logger.error('error when connecting to the database:', error);
        return undefined;
    }
}
