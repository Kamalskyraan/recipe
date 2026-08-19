"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactsController = void 0;
const helper_1 = require("../utils/helper");
const facts_model_1 = require("../models/facts.model");
const src_model_1 = require("../models/src.model");
const fatcModel = new facts_model_1.FactsModel();
const srcModel = new src_model_1.sourceModel();
class FactsController {
    static async addUpdateFacts(req, res) {
        try {
            const { id, cat_id, status, translations } = req.body;
            const result = await fatcModel.createUpdateFacts({
                id,
                cat_id,
                status,
            });
            if (result.success === 0) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], result.error, "");
            }
            const factId = result.id;
            for (const item of translations) {
                await srcModel.saveTranslation({
                    module: "facts",
                    record_id: factId,
                    field_name: "name",
                    lang_code: item.lang_code,
                    value: item.name,
                });
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [], id ? "Fact updated successfully" : "Fact added successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.message);
        }
    }
}
exports.FactsController = FactsController;
