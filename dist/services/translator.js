"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const axios_1 = __importDefault(require("axios"));
const TRANSLATE_API = "https://transmodel.skyraantech.com/server/translate";
const translateText = async (text, targetLang, sourceLang = "en") => {
    try {
        const { data } = await axios_1.default.post(TRANSLATE_API, {
            text,
            source: sourceLang,
            target: targetLang,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 60000,
        });
        if (data?.success) {
            return data.translated;
        }
        return text;
    }
    catch (err) {
        console.error("Translation API Error:", err?.response?.data || err.message);
        return text;
    }
};
exports.translateText = translateText;
