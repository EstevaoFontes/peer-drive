import { Module } from "@nestjs/common";
import { redisProvider } from "./redis.provider.js";
import { REDIS_CLIENT } from "./redis.constants.js";

@Module({
    providers: [
        redisProvider
    ],
    exports: [
        REDIS_CLIENT
    ]
})
export class RedisModule {}