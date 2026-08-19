import { Request, Response } from "express";
import { addCountrySchema } from "../validations/validator";
import { sendResponse, validateRequest } from "../utils/helper";

export class CountryController {
  static async addUpdateCountry(req: Request, res: Response) {
    try {
      const { id, image, country_name, status } = await validateRequest(
        req.body,
        addCountrySchema,
      );

      if (id) {
      }
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
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [err]);
    }
  }
}
