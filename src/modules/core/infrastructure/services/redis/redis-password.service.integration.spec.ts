import { describe, it, expect } from "vitest";
import { RedisPasswordCache } from "./redis-password.service.js";
import { createClient, type RedisClientType } from "redis";


describe("Test service Redis Cache password.", () => {

    let redis: RedisClientType;
    let redisPasswordCache: RedisPasswordCache;

    beforeAll(async () => {
        redis = createClient({
            url: process.env.REDIS_URL
        });

        redis.on("error", (error) => {
            console.error("Redis Client Error:", error);
        });

        await redis.connect();

        redisPasswordCache = new RedisPasswordCache(redis);
    });

    afterAll(async () => {
        if (redis?.isOpen) {
            await redis.quit();
        }
    });


    it("Should save data in cache.", async () => {

        await redisPasswordCache.save("123456", "john@gmail.com", 300);

        const payload = await redis.get("forgot-password:123456");

        expect(payload).not.toBeNull();
        
        expect(JSON.parse(payload!)).toEqual({
            email: "john@gmail.com"
        });

    });

    it("Should Consume Code in Cache.", async () => {

        await redisPasswordCache.save("123456", "john@gmail.com", 300);

        const payload = await redisPasswordCache.consumeCode("123456");

        expect(payload).not.toBeNull();
        expect(payload).toEqual({ email: "john@gmail.com" });

        const cacheData = await redis.get("forgot-password:123456");

        expect(cacheData).toBeNull();

    });

    it("Should Consume Code in Cache and input wrong code.", async () => {

        await redisPasswordCache.save("123456", "john@gmail.com", 300);

        const payload = await redisPasswordCache.consumeCode("456779");

        expect(payload).toBeNull();

        const cacheData = await redis.get("forgot-password:123456");

        expect(cacheData).not.toBeNull();
    });

    it("Should Consume Code in Cache and code expired.", async () => {

        await redisPasswordCache.save("123456", "john@gmail.com", 1);

        await new Promise(resolve => setTimeout(resolve, 1100));

        const payload = await redisPasswordCache.consumeCode("123456");

        expect(payload).toBeNull();

        const cacheData = await redis.get("forgot-password:123456");

        expect(cacheData).toBeNull();
    });
});