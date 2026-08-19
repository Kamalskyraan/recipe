import axios from "axios";
import { Request, Response } from "express";
import { sendResponse } from "../utils/helper";
import axiosConfig from "../config/axiosInstance";

export default class TranslationController {
  static async addUpdateTranslation(req: Request, res: Response) {
    try {
      const { text, source_lang, target_lang } = req.body;

      const response = await axiosConfig.post("/translate", {
        text,
        source_lang,
        target_lang,
      });

      console.log(response, "resp");
      return sendResponse(
        res,
        200,
        1,
        response.data,
        "Translation fetched successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Translation Failed", [
        err.response?.data || err.message,
      ]);
    }
  }
}
