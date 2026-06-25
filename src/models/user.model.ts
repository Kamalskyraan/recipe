import { IProfileAdd } from "../interfaces/user.interface";
import { executeQuery } from "../utils/helper";

export class userModel {
  async updateProfileData(data: IProfileAdd) {
    try {
      const query = `
      UPDATE users
      SET
        name = ?,
        email = ?,
        profile_img = ?
      WHERE user_id = ?
    `;

      const result: any = await executeQuery(query, [
        data.user_name || null,
        data.email || null,
        data.profile_img || null,
        data.user_id,
      ]);

      return result.affectedRows > 0;
    } catch (err) {
      throw err;
    }
  }
}
