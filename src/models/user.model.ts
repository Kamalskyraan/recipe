import { IProfileAdd } from "../interfaces/user.interface";
import { executeQuery } from "../utils/helper";
import { sourceModel } from "./src.model";

const srcMdl = new sourceModel();
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

  async getProfileData(user_id: string) {
    try {
      const query = `
      SELECT
        user_id,
        name AS user_name,
        email,
        profile_img
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `;

      const rows: any = await executeQuery(query, [user_id]);

      if (!rows?.length) {
        return null;
      }

      const user = rows[0];

      let profileImg = null;

      if (user.profile_img) {
        const mediaResult = await srcMdl.getUploads({
          id: user.profile_img,
        });

        profileImg = mediaResult?.data?.[0] || null;

        if (profileImg) {
          profileImg.url = `${process.env.ASSET_URL}${profileImg.url}`;
        }
      }

      return {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        profile_img: profileImg,
      };
    } catch (err) {
      throw err;
    }
  }
}
