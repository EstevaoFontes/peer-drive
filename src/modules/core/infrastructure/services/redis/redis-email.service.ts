import { IMailChangeCacheService, IPendingMailService } from "../../../services/mail-change-cache-service.interface.js";
import { type RedisClientType } from "redis";
import { REDIS_CLIENT } from "../../cache/redis.constants.js";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RedisEmailCache implements IMailChangeCacheService {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: RedisClientType
    ) { }

    async save(userId: string, data: IPendingMailService, expireInSeconds: number): Promise<void> {

        await this.redis.set(`change-email:${userId}`,
            JSON.stringify({ code: data.code, email: data.newEmail }),
            {
                EX: expireInSeconds
            }
        );
    }

    async consumeCode(userId: string, code: string): Promise<{ newEmail: string } | null> {

        const script = `
        local payload = redis.call("GET", KEYS[1])

        if not payload then
            return nil
        end

        local data = cjson.decode(payload)

        if data.code ~= ARGV[1] then
            return nil
        end

        redis.call("DEL", KEYS[1])

        return data.email
    `;

        const result = await this.redis.eval(script, {
            keys: [`change-email:${userId}`],
            arguments: [code]
        });

        if (result === null) {
            return null;
        }

        return { newEmail: result as string };
    }

}