import { type Config, PrismaClient } from "@prisma/client";
import { RedisClient } from "./Redis";

import type { UsingClient } from "seyfert";

//Hardcoded type, don't ask.
type CachedConfig = { config: Config };

export class Database {
    private prisma: PrismaClient;
    private redis: RedisClient;

    public constructor(private client: UsingClient) {
        this.prisma = new PrismaClient();
        this.redis = new RedisClient();
    }

    public async connect() {
        await this.prisma.$connect().then(() => {
            this.client.logger.info("Connected to the database!");
        });
    }

    public async getPrefix(guildId: string): Promise<string> {
        const cachedData = await this.redis.get<CachedConfig>(`config:${guildId}`);
        if (cachedData) return cachedData.config.prefix ?? this.client.config.defaultPrefix;

        const data = await this.prisma.guild.findUnique({
            where: { guildId },
            select: {
                config: {
                    select: { prefix: true },
                },
            },
        });

        return data?.config?.prefix ?? this.client.config.defaultPrefix;
    }

    public async getLanguage(guildId: string): Promise<string> {
        const cachedData = await this.redis.get<CachedConfig>(`config:${guildId}`);
        if (cachedData) return cachedData.config.language ?? this.client.config.defaultLanguage;

        const data = await this.prisma.guild.findUnique({
            where: { guildId },
            select: {
                config: {
                    select: { language: true },
                },
            },
        });

        return data?.config?.language ?? this.client.config.defaultLanguage;
    }

    public async getRequestChannel(guildId: string): Promise<string | null> {
        const cachedData = await this.redis.get<CachedConfig>(`config:${guildId}`);
        if (cachedData) return cachedData.config.requestChannel;

        const data = await this.prisma.guild.findUnique({
            where: { guildId },
            select: {
                config: {
                    select: { requestChannel: true },
                },
            },
        });

        return data?.config?.requestChannel ?? null;
    }

    public async setPrefix(guildId: string, prefix: string): Promise<void> {
        await this.prisma.guild.upsert({
            where: { guildId },
            update: {
                config: {
                    update: { prefix },
                },
            },
            create: {
                guildId,
                config: {
                    create: { prefix },
                },
            },
        });

        const updatedData = await this.prisma.guild.findUnique({
            where: { guildId },
            select: { config: true },
        });

        await this.redis.setex(`config:${guildId}`, updatedData);
    }

    public async setLanguage(guildId: string, language: string): Promise<void> {
        await this.prisma.guild.upsert({
            where: { guildId },
            update: {
                config: {
                    update: { language },
                },
            },
            create: {
                guildId,
                config: {
                    create: { language },
                },
            },
        });

        const updatedData = await this.prisma.guild.findUnique({
            where: { guildId },
            select: { config: true },
        });

        await this.redis.setex(`config:${guildId}`, updatedData);
    }

    public async setRequestChannel(guildId: string, requestChannel: string): Promise<void> {
        await this.prisma.guild.upsert({
            where: { guildId },
            update: {
                config: {
                    update: { requestChannel },
                },
            },
            create: {
                guildId,
                config: {
                    create: { requestChannel },
                },
            },
        });

        const updatedData = await this.prisma.guild.findUnique({
            where: { guildId },
            select: { config: true },
        });

        await this.redis.setex(`config:${guildId}`, updatedData);
    }
}
