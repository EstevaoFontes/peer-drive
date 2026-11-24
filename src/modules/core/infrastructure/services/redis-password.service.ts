import { IPasswordCacheService } from "../../services/password-change-cache-service.interface.js";
import { type RedisClientType } from "redis";
import { REDIS_CLIENT } from "../cache/redis.constants.js";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class RedisPasswordCache implements IPasswordCacheService {
    constructor(
        @Inject(REDIS_CLIENT)
        private readonly redis: RedisClientType
    ) { }

    async save(code: string, email: string, timeStampInSeconds: number): Promise<void> {

        await this.redis.set(`forgot-password:${code}`,
            JSON.stringify({ email: email }),
            {
                EX: timeStampInSeconds
            }
        );
    }


    async consumeCode(code: string): Promise<{ email: string; } | null> {

        const payload = await this.redis.getDel(`forgot-password:${code}`);

        if (payload === null) {
            return null;
        }

        return JSON.parse(payload);

    }
}   