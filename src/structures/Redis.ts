import { Redis } from "iovalkey";

const MAX_DURATION = 3600;

export const redis: Redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD,
});

export class RedisClient {
    public async get<T>(key: string): Promise<T | null> {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    public setex(key: string, value: unknown, duration = MAX_DURATION): Promise<"OK"> {
        return redis.setex(key, duration, JSON.stringify(value));
    }
}
