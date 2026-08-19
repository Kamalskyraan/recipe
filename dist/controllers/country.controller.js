"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const validator_1 = require("../validations/validator");
const helper_1 = require("../utils/helper");
class CountryController {
    static async addUpdateCountry(req, res) {
        try {
            const { id, image, country_name, status } = await (0, helper_1.validateRequest)(req.body, validator_1.addCountrySchema);
            if (id) {
            }
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
        }
    }
    static async getCountry(req, res) {
        try {
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [err]);
        }
    }
}
exports.CountryController = CountryController;
