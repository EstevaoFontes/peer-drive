import { RedisConnection } from "./redis.connection.js";
import { REDIS_CLIENT } from "./redis.constants.js";

export const redisProvider = {
    provide: REDIS_CLIENT,
    useFactory: async () => {
        const redisConnection = new RedisConnection();

        return await redisConnection.connect();
    }
};