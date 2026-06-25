import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { addCountrySchema, saveTipSchema } from "../validations/validator";
import { sourceModel } from "../models/src.model";
import { translateText } from "../services/translator";

const srcMdl = new sourceModel();
export class sourceController {
  static async addUpdateTips(req: Request, res: Response) {
    try {
      const { id, image, status, translations } = await validateRequest(
        req.body,
        saveTipSchema,
      );

      if (id) {
        const existingTip = await srcMdl.tipFind({
          id,
        });

        if (!existingTip || existingTip.length === 0) {
          return sendResponse(res, 200, 0, [], "Tip not found", []);
        }

        const updatedTip = await srcMdl.tipUpdate({
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

      const createdTip = await srcMdl.tipCreate({
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

      const tipsData = await srcMdl.tipFind({
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

      const tip = await srcMdl.getRandomTip({
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
        await srcMdl.updateCountry({
          id,
          image,
          status,
        });

        countryId = id;
      } else {
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
        if (lang.code === "en") continue;

        const translatedValue = await translateText(name, lang.code);

        await srcMdl.saveTranslation({
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

      const data = await srcMdl.getCountry({
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

  static async addUpdateLanguage(req: Request, res: Response) {
    try {
      const { id, image, name, status } = await validateRequest(
        req.body,
        addCountrySchema,
      );

      let countryId;

      if (id) {
        await srcMdl.updateCountry({
          id,
          image,
          status,
        });

        countryId = id;
      } else {
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
        if (lang.code === "en") continue;

        const translatedValue = await translateText(name, lang.code);

        await srcMdl.saveTranslation({
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

//

export class UploadController {
  static async upload(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files?.length) {
        return sendResponse(res, 200, 0, [], "File is required", []);
      }

      const uploadedFiles = files.map((file) => {
        const mimeType = file.mimetype;

        let mediaType = "file";

        if (mimeType.startsWith("image/")) {
          mediaType = "image";
        } else if (mimeType.startsWith("video/")) {
          mediaType = "video";
        } else if (mimeType.startsWith("audio/")) {
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

      return sendResponse(
        res,
        200,
        1,
        responseData,
        "Files uploaded successfully",
        [],
      );
    } catch (error: any) {
      console.error(error);

      return sendResponse(
        res,
        500,
        0,
        [],
        error.message || "Internal Server Error",
        [],
      );
    }
  }

  static async getUploads(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, media_type, id } = req.body;

      const result = await srcMdl.getUploads({
        page: Number(page),
        limit: Number(limit),
        media_type,
        id,
      });

      return sendResponse(
        res,
        200,
        1,
        result,
        "Uploads fetched successfully",
        [],
      );
    } catch (error: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        error.message || "Internal Server Error",
        [],
      );
    }
  }
}
