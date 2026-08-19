import { executeQuery } from "../utils/helper";

export class FactsModel {
  async createUpdateFacts(data: any) {
    try {
      let result: any;

      if (data.id) {
        result = await executeQuery(
          `
        UPDATE facts
        SET
            cat_id = ?,
            status = ?
        WHERE id = ?
        `,
          [data.cat_id, data.status, data.id],
        );

        return {
          success: 1,
          id: data.id,
        };
      }

      result = await executeQuery(
        `
      INSERT INTO facts
      (
          cat_id,
          status
      )
      VALUES
      (
          ?, ?
      )
      `,
        [data.cat_id, data.status],
      );

      return {
        success: 1,
        id: result.insertId,
      };
    } catch (error: any) {
      return {
        success: 0,
        error: error.message,
      };
    }
  }
}
