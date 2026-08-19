"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactsModel = void 0;
const helper_1 = require("../utils/helper");
class FactsModel {
    async createUpdateFacts(data) {
        try {
            let result;
            if (data.id) {
                result = await (0, helper_1.executeQuery)(`
        UPDATE facts
        SET
            cat_id = ?,
            status = ?
        WHERE id = ?
        `, [data.cat_id, data.status, data.id]);
                return {
                    success: 1,
                    id: data.id,
                };
            }
            result = await (0, helper_1.executeQuery)(`
      INSERT INTO facts
      (
          cat_id,
          status
      )
      VALUES
      (
          ?, ?
      )
      `, [data.cat_id, data.status]);
            return {
                success: 1,
                id: result.insertId,
            };
        }
        catch (error) {
            return {
                success: 0,
                error: error.message,
            };
        }
    }
}
exports.FactsModel = FactsModel;
