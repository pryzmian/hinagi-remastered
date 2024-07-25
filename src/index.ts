import "dotenv/config";

import { Logger } from 'seyfert';
import { HinagiClient } from './structures/Client';

Logger.saveOnFile = 'all';
Logger.dirname = 'logs';

const client = new HinagiClient();

export default client;
