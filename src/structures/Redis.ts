import { Redis } from "ioredis";

export class RedisClient extends Redis {
    private static _instance: RedisClient;

    constructor() {
        super({
            host: process.env.REDIS_HOST,
            password: process.env.REDIS_PASSWORD,
            port: Number(process.env.REDIS_PORT),
        });
    }

    static getInstance(): RedisClient {
        if (!RedisClient._instance) {
            RedisClient._instance = new RedisClient();
        }

        return RedisClient._instance;
    }
}