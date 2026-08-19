import { redisClient } from "../config/redis";

export class cacheService {
  static async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value);
  }

  static async set(key: string, value: any, ttl: number = 300): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl,
    });
  }

  static async delete(key: string) {
    await redisClient.del(key);
  }

  static async deletePattern(pattern: string) {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}
