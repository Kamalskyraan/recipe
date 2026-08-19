"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const axiosInstance_1 = __importDefault(require("../config/axiosInstance"));
class TranslationController {
    static async addUpdateTranslation(req, res) {
        try {
            const { text, source_lang, target_lang } = req.body;
            const response = await axiosInstance_1.default.post("/translate", {
                text,
                source_lang,
                target_lang,
            });
            console.log(response, "resp");
            return (0, helper_1.sendResponse)(res, 200, 1, response.data, "Translation fetched successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Translation Failed", [
                err.response?.data || err.message,
            ]);
        }
    }
}
exports.default = TranslationController;
