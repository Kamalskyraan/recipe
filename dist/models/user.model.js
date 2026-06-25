"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const helper_1 = require("../utils/helper");
class userModel {
    async updateProfileData(data) {
        try {
            const query = `
      UPDATE users
      SET
        name = ?,
        email = ?,
        profile_img = ?
      WHERE user_id = ?
    `;
            const result = await (0, helper_1.executeQuery)(query, [
                data.user_name || null,
                data.email || null,
                data.profile_img || null,
                data.user_id,
            ]);
            return result.affectedRows > 0;
        }
        catch (err) {
            throw err;
        }
    }
}
exports.userModel = userModel;
