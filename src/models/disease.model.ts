import { db } from "../config/db";

export class diseaseModel {
  // static async addUpdateDisease(data: any) {
  //   const { id, disease_code, image, lang_code , disease_name} = data;

  //   try {
  //     let diseaseId = id;

  //     if (!id) {
  //       const [result]: any = await db.query(
  //         `INSERT INTO diseases
  //               (disease_code,image)
  //               VALUES (?,?)`,
  //         [disease_code, image],
  //       );

  //       diseaseId = result.insertId;
  //     } else {
  //       await db.query(
  //         `UPDATE diseases
  //                SET
  //                   disease_code=?,
  //                   image=?
  //                WHERE id=?`,
  //         [disease_code, image, diseaseId],
  //       );

  //       await db.query(
  //         `DELETE FROM disease_translations
  //                WHERE disease_id=?`,
  //         [diseaseId],
  //       );
  //     }

  //     for (const item of translations) {
  //       await db.query(
  //         `INSERT INTO disease_translations
  //               (
  //                   disease_id,
  //                   language_code,
  //                   disease_name,
  //                   short_description,
  //                   main_description
  //               )
  //               VALUES (?,?,?,?,?)`,
  //         [
  //           diseaseId,
  //           item.language_code,
  //           item.disease_name,
  //           item.short_description,
  //           item.main_description,
  //         ],
  //       );
  //     }

  //     await db.commit();

  //     return {
  //       status: true,
  //       message: id
  //         ? "Disease updated successfully."
  //         : "Disease created successfully.",
  //     };
  //   } catch (err) {
  //     await db.rollback();
  //     throw err;
  //   }
  // }
}
