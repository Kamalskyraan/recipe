"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const helper_1 = require("../utils/helper");
const src_model_1 = require("./src.model");
const srcMdl = new src_model_1.sourceModel();
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
    async getProfileData(user_id) {
        try {
            const query = `
      SELECT
        user_id,
        name AS user_name,
        email,
        profile_img
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `;
            const rows = await (0, helper_1.executeQuery)(query, [user_id]);
            if (!rows?.length) {
                return null;
            }
            const user = rows[0];
            let profileImg = null;
            if (user.profile_img) {
                const mediaResult = await srcMdl.getUploads({
                    id: user.profile_img,
                });
                profileImg = mediaResult?.data?.[0] || null;
                if (profileImg) {
                    profileImg.url = `${process.env.ASSET_URL}${profileImg.url}`;
                }
            }
            return {
                user_id: user.user_id,
                user_name: user.user_name,
                email: user.email,
                profile_img: profileImg,
            };
        }
        catch (err) {
            throw err;
        }
    }
}
exports.userModel = userModel;
