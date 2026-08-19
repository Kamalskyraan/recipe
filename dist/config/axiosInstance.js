"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axiosConfig = axios_1.default.create({
    baseURL: "https://transmodel.skyraantech.com/",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});
exports.default = axiosConfig;
