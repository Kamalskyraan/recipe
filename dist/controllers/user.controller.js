"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const helper_1 = require("../utils/helper");
const user_model_1 = require("../models/user.model");
const userMdl = new user_model_1.userModel();
class userController {
    static async UpdateProfileData(req, res) {
        try {
            const { user_id, user_name, email, profile_img } = req.body;
            if (!user_id) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User ID is required", []);
            }
            const updated = await userMdl.updateProfileData({
                user_id,
                user_name,
                email,
                profile_img,
            });
            if (!updated) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Unable to update profile", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Profile updated successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message, []);
        }
    }
}
exports.userController = userController;
