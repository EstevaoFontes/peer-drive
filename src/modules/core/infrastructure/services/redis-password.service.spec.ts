import { describe, it, expect, beforeEach, vi } from "vitest";
import { RedisPasswordCache } from "./redis-password.service.js";
import type { RedisClientType } from "redis";

describe("Test service Redis Cache password.", () => {

    let redisPasswordCache: RedisPasswordCache;

    const input = {
        code: "123456",
        email: "john@gmail.com",
        timeStamp: 300
    };

    const redisMock = {
        set: vi.fn(),
        getDel: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();

        redisPasswordCache = new RedisPasswordCache(
            redisMock as unknown as RedisClientType
        );
    });

    it("Should save data in cache.", async () => {

        await redisPasswordCache.save(input.code, input.email, input.timeStamp);

        expect(redisMock.set).toHaveBeenCalledWith(
            `forgot-password:${input.code}`,
            JSON.stringify({ email: input.email }),
            {
                EX: input.timeStamp
            }
        );
    });

    it("Should Consume Code in Cache.", async () => {

        vi.mocked(redisMock.getDel).mockResolvedValue(
            JSON.stringify({ email: "john@gmail.com" })
        );

        const result = await redisPasswordCache.consumeCode(input.code);

        expect(redisMock.getDel).toHaveBeenCalledWith(`forgot-password:${input.code}`);

        expect(result).toEqual({ email: "john@gmail.com" });


    });

    it("Should Consume Code in Cache and return null.", async () => {

        vi.mocked(redisMock.getDel).mockResolvedValue(null);

        const result = await redisPasswordCache.consumeCode(input.code);

        expect(redisMock.getDel).toHaveBeenCalledWith(`forgot-password:${input.code}`);

        expect(result).toBeNull();
    });
});