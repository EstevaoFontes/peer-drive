if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL não foi definida.");
}

export const redisConfig = {
    url: process.env.REDIS_URL
};