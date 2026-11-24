import { describe, it, expect, afterAll } from "vitest";
import { type RedisClientType, createClient } from "redis";
import { RedisEmailCache } from "./redis-email.service.js";

describe("Test Redis Email Cache.", () => {

    let redis: RedisClientType;
    let redisEmailCache: RedisEmailCache;

    beforeAll(async () => {

        redis = createClient({
            url: process.env.REDIS_URL
        });

        redis.on("error", (error) => {
            console.error("Redis Client Error:", error);
        });

        await redis.connect();

        redisEmailCache = new RedisEmailCache(redis);
    });

    afterAll(async () => {
        if (redis?.isOpen) {
            await redis.quit();
        }
    });


    it("Should save email data in cache.", async () => {

        await redisEmailCache.save("123-abc", { newEmail: "luke@gmail.com", code: "123456" }, 300);

        const payload = await redis.get("change-email:123-abc");

        expect(payload).not.toBeNull();

        expect(JSON.parse(payload!)).toEqual({ email: "luke@gmail.com", code: "123456" });

        const ttl = await redis.ttl("change-email:123-abc");

        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThanOrEqual(300);
    });

    it("Should consume code and return new email.", async () => {

        await redisEmailCache.save("123-abc", { newEmail: "luke@gmail.com", code: "123456" }, 300);

        const payload = await redisEmailCache.consumeCode("123-abc", "123456");

        expect(payload).not.toBeNull();
        expect(payload).toEqual({ newEmail: "luke@gmail.com" });

        const cacheData = await redis.get("change-email:123-abc");

        expect(cacheData).toBeNull();

        const secondPayload = await redisEmailCache.consumeCode("123-abc", "123456");

        expect(secondPayload).toBeNull();
    });

    it("Should return null when code is invalid.", async () => {

        await redisEmailCache.save("123-abc", { newEmail: "luke@gmail.com", code: "123456" }, 300);

        const payload = await redisEmailCache.consumeCode("123-abc", "456123");

        expect(payload).toBeNull();

        const cacheData = await redis.get("change-email:123-abc");

        expect(cacheData).not.toBeNull();
    });

    it("Should return null when code expired.", async () => {

        await redisEmailCache.save("123-abc", { newEmail: "luke@gmail.com", code: "123456" }, 1);

        await new Promise(resolve => setTimeout(resolve, 1100));

        const payload = await redisEmailCache.consumeCode("123-abc", "123456");

        expect(payload).toBeNull();

        const cacheData = await redis.get("change-email:123-abc");

        expect(cacheData).toBeNull();
    });
});
