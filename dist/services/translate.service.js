"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const axios_1 = __importDefault(require("axios"));
const TRANSLATION_URL = "https://transmodel.skyraantech.com/server/translate";
const translateText = async (text, target) => {
    if (target === "en")
        return text;
    try {
        const { data } = await axios_1.default.post(TRANSLATION_URL, {
            text,
            source: "en",
            target,
        }, {
            timeout: 60000,
        });
        return data.translated;
    }
    catch (err) {
        console.log(err.response?.data || err.message);
        return text;
    }
};
exports.translateText = translateText;
