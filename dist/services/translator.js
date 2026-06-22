"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
const google_translate_api_x_1 = require("google-translate-api-x");
const translateText = async (text, targetLang) => {
    try {
        const result = await (0, google_translate_api_x_1.translate)(text, {
            to: targetLang,
        });
        return result.text;
    }
    catch (error) {
        console.log("Translation Error:", error);
        return text;
    }
};
exports.translateText = translateText;
