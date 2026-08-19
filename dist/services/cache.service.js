"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheService = void 0;
const redis_1 = require("../config/redis");
class cacheService {
    static async get(key) {
        const value = await redis_1.redisClient.get(key);
        if (!value)
            return null;
        return JSON.parse(value);
    }
    static async set(key, value, ttl = 300) {
        await redis_1.redisClient.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    }
    static async delete(key) {
        await redis_1.redisClient.del(key);
    }
    static async deletePattern(pattern) {
        const keys = await redis_1.redisClient.keys(pattern);
        if (keys.length > 0) {
            await redis_1.redisClient.del(keys);
        }
    }
}
exports.cacheService = cacheService;
