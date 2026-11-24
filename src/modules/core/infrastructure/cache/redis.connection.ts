import { createClient, type RedisClientType } from "redis";
import { redisConfig } from "./redis.config.js";

export class RedisConnection {

    async connect(): Promise<RedisClientType> {
        
        const client = createClient({
            url: redisConfig.url
        });

        client.on("error", err => console.log("Redis Client Error", err));

        await client.connect();

        return client;
    }
}