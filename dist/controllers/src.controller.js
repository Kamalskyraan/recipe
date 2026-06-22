"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../validations/validator");
const src_model_1 = require("../models/src.model");
const translator_1 = require("../services/translator");
class sourceController {
    static async addUpdateTips(req, res) {
        try {
            const { id, image, status, translations } = await (0, helper_1.validateRequest)(req.body, validator_1.saveTipSchema);
            if (id) {
                const existingTip = await this.srcMdl.tipFind({
                    id,
                });
                if (!existingTip || existingTip.length === 0) {
                    return (0, helper_1.sendResponse)(res, 200, 0, [], "Tip not found", []);
                }
                const updatedTip = await this.srcMdl.tipUpdate({
                    id,
                    image,
                    status,
                    translations,
                });
                return (0, helper_1.sendResponse)(res, 200, 1, updatedTip, "Tip updated successfully");
            }
            const createdTip = await this.srcMdl.tipCreate({
                image,
                translations,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, createdTip, "Tip created successfully");
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async getAllTips(req, res) {
        try {
            const { id, status, lang_code = "en" } = req.body;
            const tipsData = await this.srcMdl.tipFind({
                id,
                status,
                lang_code,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [tipsData], "Tips Fetched Successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async getRandomTips(req, res) {
        try {
            const { lang_code = "en", c_date } = req.body;
            const tip = await this.srcMdl.getRandomTip({
                lang_code,
                c_date,
            });
            if (!tip) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "No tips found", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, tip, "Random Tip Fetched Successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err?.message || err);
        }
    }
    // country
    static async addUpdateCountry(req, res) {
        try {
            const { id, image, name, status } = await (0, helper_1.validateRequest)(req.body, validator_1.addCountrySchema);
            let countryId;
            if (id) {
                await this.srcMdl.updateCountry({
                    id,
                    image,
                    status,
                });
                countryId = id;
            }
            else {
                const result = await this.srcMdl.addCountry({
                    image,
                    status,
                });
                countryId = result.insertId;
            }
            const languages = await this.srcMdl.getLanguages();
            await this.srcMdl.saveTranslation({
                module: "country",
                record_id: countryId,
                field_name: "name",
                lang_code: "en",
                value: name,
            });
            for (const lang of languages) {
                if (lang.code === "en")
                    continue;
                const translatedValue = await (0, translator_1.translateText)(name, lang.code);
                await this.srcMdl.saveTranslation({
                    module: "country",
                    record_id: countryId,
                    field_name: "name",
                    lang_code: lang.code,
                    value: translatedValue,
                });
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Country saved successfully");
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async getCountry(req, res) {
        try {
            const { id, status, lang_code = "en" } = req.body;
            const data = await this.srcMdl.getCountry({
                id,
                status,
                lang_code,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, data, "Countries fetched successfully");
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.message || err);
        }
    }
    //
    static async addUpdateLanguage(req, res) {
        try {
            const { id, image, name, status } = await (0, helper_1.validateRequest)(req.body, validator_1.addCountrySchema);
            let countryId;
            if (id) {
                await this.srcMdl.updateCountry({
                    id,
                    image,
                    status,
                });
                countryId = id;
            }
            else {
                const result = await this.srcMdl.addCountry({
                    image,
                    status,
                });
                countryId = result.insertId;
            }
            const languages = await this.srcMdl.getLanguages();
            await this.srcMdl.saveTranslation({
                module: "country",
                record_id: countryId,
                field_name: "name",
                lang_code: "en",
                value: name,
            });
            for (const lang of languages) {
                if (lang.code === "en")
                    continue;
                const translatedValue = await (0, translator_1.translateText)(name, lang.code);
                await this.srcMdl.saveTranslation({
                    module: "country",
                    record_id: countryId,
                    field_name: "name",
                    lang_code: lang.code,
                    value: translatedValue,
                });
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Country saved successfully");
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
}
exports.sourceController = sourceController;
sourceController.srcMdl = new src_model_1.sourceModel();
class UploadController {
    static async uploadFiles(req, res) {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No files uploaded",
                });
            }
            return res.status(200).json({
                success: true,
                count: files.length,
                files: files.map((file) => ({
                    originalName: file.originalname,
                    fileName: file.filename,
                    mimeType: file.mimetype,
                    size: file.size,
                    path: file.path,
                })),
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}
exports.default = UploadController;
