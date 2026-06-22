import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { addCountrySchema, saveTipSchema } from "../validations/validator";
import { sourceModel } from "../models/src.model";
import { translateText } from "../services/translator";
export class sourceController {
  private static srcMdl = new sourceModel();

  static async addUpdateTips(req: Request, res: Response) {
    try {
      const { id, image, status, translations } = await validateRequest(
        req.body,
        saveTipSchema,
      );

      if (id) {
        const existingTip = await this.srcMdl.tipFind({
          id,
        });

        if (!existingTip || existingTip.length === 0) {
          return sendResponse(res, 200, 0, [], "Tip not found", []);
        }

        const updatedTip = await this.srcMdl.tipUpdate({
          id,
          image,
          status,
          translations,
        });

        return sendResponse(
          res,
          200,
          1,
          updatedTip,
          "Tip updated successfully",
        );
      }

      const createdTip = await this.srcMdl.tipCreate({
        image,
        translations,
      });

      return sendResponse(res, 200, 1, createdTip, "Tip created successfully");
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  }

  static async getAllTips(req: Request, res: Response) {
    try {
      const { id, status, lang_code = "en" } = req.body;

      const tipsData = await this.srcMdl.tipFind({
        id,
        status,
        lang_code,
      });

      return sendResponse(
        res,
        200,
        1,
        [tipsData],
        "Tips Fetched Successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  }

  static async getRandomTips(req: Request, res: Response) {
    try {
      const { lang_code = "en", c_date } = req.body;

      const tip = await this.srcMdl.getRandomTip({
        lang_code,
        c_date,
      });

      if (!tip) {
        return sendResponse(res, 200, 0, [], "No tips found", []);
      }

      return sendResponse(
        res,
        200,
        1,
        tip,
        "Random Tip Fetched Successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err?.message || err,
      );
    }
  }

  // country
  static async addUpdateCountry(req: Request, res: Response) {
    try {
      const { id, image, name, status } = await validateRequest(
        req.body,
        addCountrySchema,
      );

      let countryId;

      if (id) {
        await this.srcMdl.updateCountry({
          id,
          image,
          status,
        });

        countryId = id;
      } else {
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
        if (lang.code === "en") continue;

        const translatedValue = await translateText(name, lang.code);

        await this.srcMdl.saveTranslation({
          module: "country",
          record_id: countryId,
          field_name: "name",
          lang_code: lang.code,
          value: translatedValue,
        });
      }

      return sendResponse(res, 200, 1, [], "Country saved successfully");
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  }

  static async getCountry(req: Request, res: Response) {
    try {
      const { id, status, lang_code = "en" } = req.body;

      const data = await this.srcMdl.getCountry({
        id,
        status,
        lang_code,
      });

      return sendResponse(res, 200, 1, data, "Countries fetched successfully");
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.message || err,
      );
    }
  }

  //
  static async addUpdateLanguage(req: Request, res: Response) {
    try {
      const { id, image, name, status } = await validateRequest(
        req.body,
        addCountrySchema,
      );

      let countryId;

      if (id) {
        await this.srcMdl.updateCountry({
          id,
          image,
          status,
        });

        countryId = id;
      } else {
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
        if (lang.code === "en") continue;

        const translatedValue = await translateText(name, lang.code);

        await this.srcMdl.saveTranslation({
          module: "country",
          record_id: countryId,
          field_name: "name",
          lang_code: lang.code,
          value: translatedValue,
        });
      }

      return sendResponse(res, 200, 1, [], "Country saved successfully");
    } catch (err: any) {
      console.log(err);
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.errors || err.message || err,
      );
    }
  }
}

export default class UploadController {
  static async uploadFiles(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

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
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
