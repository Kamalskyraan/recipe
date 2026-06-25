"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = exports.sourceController = void 0;
const helper_1 = require("../utils/helper");
const validator_1 = require("../validations/validator");
const src_model_1 = require("../models/src.model");
const translator_1 = require("../services/translator");
const srcMdl = new src_model_1.sourceModel();
class sourceController {
    static async addUpdateTips(req, res) {
        try {
            const { id, image, status, translations } = await (0, helper_1.validateRequest)(req.body, validator_1.saveTipSchema);
            if (id) {
                const existingTip = await srcMdl.tipFind({
                    id,
                });
                if (!existingTip || existingTip.length === 0) {
                    return (0, helper_1.sendResponse)(res, 200, 0, [], "Tip not found", []);
                }
                const updatedTip = await srcMdl.tipUpdate({
                    id,
                    image,
                    status,
                    translations,
                });
                return (0, helper_1.sendResponse)(res, 200, 1, updatedTip, "Tip updated successfully");
            }
            const createdTip = await srcMdl.tipCreate({
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
            const tipsData = await srcMdl.tipFind({
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
            const tip = await srcMdl.getRandomTip({
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
                await srcMdl.updateCountry({
                    id,
                    image,
                    status,
                });
                countryId = id;
            }
            else {
                const result = await srcMdl.addCountry({
                    image,
                    status,
                });
                countryId = result.insertId;
            }
            const languages = await srcMdl.getLanguages();
            await srcMdl.saveTranslation({
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
                await srcMdl.saveTranslation({
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
            const data = await srcMdl.getCountry({
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
    static async addUpdateLanguage(req, res) {
        try {
            const { id, image, name, status } = await (0, helper_1.validateRequest)(req.body, validator_1.addCountrySchema);
            let countryId;
            if (id) {
                await srcMdl.updateCountry({
                    id,
                    image,
                    status,
                });
                countryId = id;
            }
            else {
                const result = await srcMdl.addCountry({
                    image,
                    status,
                });
                countryId = result.insertId;
            }
            const languages = await srcMdl.getLanguages();
            await srcMdl.saveTranslation({
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
                await srcMdl.saveTranslation({
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
//
class UploadController {
    static async upload(req, res) {
        try {
            const files = req.files;
            if (!files?.length) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "File is required", []);
            }
            const uploadedFiles = files.map((file) => {
                const mimeType = file.mimetype;
                let mediaType = "file";
                if (mimeType.startsWith("image/")) {
                    mediaType = "image";
                }
                else if (mimeType.startsWith("video/")) {
                    mediaType = "video";
                }
                else if (mimeType.startsWith("audio/")) {
                    mediaType = "audio";
                }
                return {
                    org_name: file.originalname,
                    file_name: file.filename,
                    mime_type: mimeType,
                    media_type: mediaType,
                    file_size: file.size,
                    path: file.path.replace(/\\/g, "/"),
                    url: `${file.path.replace(/\\/g, "/")}`,
                };
            });
            const data = await srcMdl.insertMultipleMedia(uploadedFiles);
            const responseData = uploadedFiles.map((file, index) => ({
                id: data[index],
                ...file,
                url: `${process.env.ASSET_URL}${file?.url}`,
            }));
            return (0, helper_1.sendResponse)(res, 200, 1, responseData, "Files uploaded successfully", []);
        }
        catch (error) {
            console.error(error);
            return (0, helper_1.sendResponse)(res, 500, 0, [], error.message || "Internal Server Error", []);
        }
    }
    static async getUploads(req, res) {
        try {
            const { page = 1, limit = 20, media_type, id } = req.body;
            const result = await srcMdl.getUploads({
                page: Number(page),
                limit: Number(limit),
                media_type,
                id,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, result, "Uploads fetched successfully", []);
        }
        catch (error) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], error.message || "Internal Server Error", []);
        }
    }
}
exports.UploadController = UploadController;
