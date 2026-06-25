import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import { userModel } from "../models/user.model";

const userMdl = new userModel();
export class userController {
  static async UpdateProfileData(req: Request, res: Response) {
    try {
      const { user_id, user_name, email, profile_img } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User ID is required", []);
      }

      const updated = await userMdl.updateProfileData({
        user_id,
        user_name,
        email,
        profile_img,
      });

      if (!updated) {
        return sendResponse(res, 200, 0, [], "Unable to update profile", []);
      }

      return sendResponse(res, 200, 1, [], "Profile updated successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }

  static async GetProfileData(req: Request, res: Response) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return sendResponse(res, 200, 0, [], "User ID is required", []);
      }

      const data = await userMdl.getProfileData(user_id);

      if (!data) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        [data],
        "Profile fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }
}
