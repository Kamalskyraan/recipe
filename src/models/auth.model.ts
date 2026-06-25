import { IGuest, IOtp } from "../interfaces/auth.interface";
import { executeQuery } from "../utils/helper";

export class AuthModel {
  async createGuest(data: IGuest) {
    return executeQuery(
      `
      INSERT INTO users
      (
        user_id,
        login_type,
        device_id,
        country,
        food_type,
        prefer_lang
      )
      VALUES
      (?, 'guest', ?, ?, ?, ?)
      `,
      [
        data.user_id,
        data.device_id,
        data.country,
        data.food_type,
        data.prefer_lang,
      ],
    );
  }

  async findGuestByDevice(device_id: string) {
    const [rows]: any = await executeQuery(
      `
      SELECT user_id , country , food_type, prefer_lang
      FROM users
      WHERE device_id = ?
      AND login_type = 'guest'
      LIMIT 1
      `,
      [device_id],
    );

    return rows[0] || "";
  }

  async insertOTP(data: IOtp) {
    const { email, otp } = data;

    await executeQuery(
      `
    DELETE FROM otp
    WHERE email = ?
    `,
      [email],
    );

    await executeQuery(
      `
    INSERT INTO otp
    (
      email,
      otp,
      expires_at
    )
    VALUES
    (
      ?,
      ?,
      DATE_ADD(NOW(), INTERVAL 5 MINUTE)
    )
    `,
      [email, otp],
    );

    return true;
  }
  async verifyOtp(email: string, otp: string) {
    const rows: any = await executeQuery(
      `
    SELECT
      id,
      email,
      otp,
      verified,
      expires_at
    FROM otp
    WHERE email = ?
      AND otp = ?
    ORDER BY id DESC
    LIMIT 1
    `,
      [email, otp],
    );

    return rows?.[0] || null;
  }

  async markOtpUsed(id: number) {
    await executeQuery(
      `
    UPDATE otp
    SET verified = 1
    WHERE id = ?
    `,
      [id],
    );
  }

  async findUserByEmail(email: string) {
    const rows: any = await executeQuery(
      `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
      [email],
    );

    return rows?.[0] || null;
  }

  async createUser(data: any) {
    const { user_id, user_name, email, password } = data;

    const result: any = await executeQuery(
      `
    INSERT INTO users
    (
    user_id,
      name,
      email,
      password
    )
    VALUES (?, ?, ? ,?)
    `,
      [user_id, user_name, email, password],
    );

    return result.insertId;
  }

  async addUserDevice(data: any) {
   
    return await executeQuery(
      `
    INSERT INTO user_devices
    (
      user_id,
      device_id,
      device_type,
      device_token
    )
    VALUES (?, ?, ?, ?)
    `,
      [data.user_id, data.device_id, data.device_type, data.device_token],
    );
  }

  async isEmailVerified(email: string) {
    const rows: any = await executeQuery(
      `
      SELECT id
      FROM otp
      WHERE email = ?
      AND verified = 1
      ORDER BY id DESC
      LIMIT 1
      `,
      [email],
    );

    return !!rows?.[0];
  }

  async updatePassword(email: string, password: string) {
    await executeQuery(
      `
    UPDATE users
    SET password = ?
    WHERE email = ?
    `,
      [password, email],
    );
  }

  async logout(user_id: string, device_id: string) {
    await executeQuery(
      `
    UPDATE user_devices SET is_active = 0 WHERE user_id = ? AND  device_id = ?
    `,
      [user_id, device_id],
    );
  }

  async getActiveDevice(user_id: string, device_id: string) {
    const result = await executeQuery(
      `
    SELECT id
    FROM user_devices
    WHERE user_id = ?
      AND device_id = ?
      AND is_active = 1
    LIMIT 1
    `,
      [user_id, device_id],
    );

    return result[0];
  }

  async updateGoogleInfo(data: any) {
    const { user_id, google_id, profile_image } = data;
    try {
      const query = `
      UPDATE users
      SET 
        google_id = ?,
        profile_image = ?,
        login_type = 'google'
      WHERE user_id = ?
    `;

      await executeQuery(query, [google_id, profile_image, user_id]);

      return true;
    } catch (err) {
      throw err;
    }
  }
}
