"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
    },
    password: process.env.REDIS_PASSWORD,
});
exports.redisClient.on("connect", () => {
    console.log(" Redis Connected");
});
exports.redisClient.on("error", (err) => {
    console.error("Redis Error:", err);
});
const connectRedis = async () => {
    try {
        if (!exports.redisClient.isOpen) {
            await exports.redisClient.connect();
        }
    }
    catch (err) {
        console.error("Redis Connection Failed:", err);
        process.exit(1);
    }
};
exports.connectRedis = connectRedis;
