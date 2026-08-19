import { Request, Response } from "express";
import { sendResponse, validateRequest } from "../utils/helper";
import { FactsModel } from "../models/facts.model";
import { sourceModel } from "../models/src.model";

const fatcModel = new FactsModel();
const srcModel = new sourceModel();

export class FactsController {
  static async addUpdateFacts(req: Request, res: Response) {
    try {
      const { id, cat_id, status, translations } = req.body;

      const result = await fatcModel.createUpdateFacts({
        id,
        cat_id,
        status,
      });

      if (result.success === 0) {
        return sendResponse(res, 200, 0, [], result.error, "");
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

      return sendResponse(
        res,
        200,
        1,
        [],
        id ? "Fact updated successfully" : "Fact added successfully",
        [],
      );
    } catch (err: any) {
      return sendResponse(
        res,
        500,
        0,
        [],
        "Internal Server Error",
        err.message,
      );
    }
  }
}
