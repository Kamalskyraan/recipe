import { Request, Response } from "express";
import {
  createUserId,
  generateToken,
  sendResponse,
  validateRequest,
} from "../utils/helper";
import { AuthModel } from "../models/auth.model";
import { sendMail } from "../services/email";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import {
  googleLoginSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validations/validator";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";
dotenv.config();
const authMdl = new AuthModel();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export class AuthController {
  static async createGuest(req: Request, res: Response) {
    try {
      const { device_id, country, food_type, prefer_lang } = req.body;
      const existingGuest = await authMdl.findGuestByDevice(device_id);
      if (existingGuest) {
        return sendResponse(
          res,
          200,
          1,
          {
            user_id: existingGuest.user_id,
            country: existingGuest.country,
            food_type: existingGuest.food_type,
            prefer_lang: existingGuest.prefer_lang,
          },
          "Guest Already Exists",
          [],
        );
      }

      const tempUserId = `TEMP_${Date.now().toString().slice(-3)}${device_id.toString().slice(-2)}${Math.floor(
        100 + Math.random() * 900,
      )}`;

      await authMdl.createGuest({
        user_id: tempUserId,
        device_id,
        country,
        food_type,
        prefer_lang,
      });

      return sendResponse(
        res,
        200,
        1,
        {
          user_id: tempUserId,
        },
        "Guest Created",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }

  static async requestOtp(req: Request, res: Response) {
    try {
      const { email, type } = req.body;

      if (!email) {
        return sendResponse(res, 200, 0, [], "Email is required", []);
      }

      const user = await authMdl.findUserByEmail(email);

      if (type === "1") {
        if (user) {
          return sendResponse(res, 200, 0, [], "User already exists", []);
        }
      }

      if (type === "2") {
        if (!user) {
          return sendResponse(res, 200, 0, [], "User not found", []);
        }
      }

      let otp = Math.floor(1000 + Math.random() * 9000).toString();

      const bypassEmail = ["abc@gmail.com", "kamalesh.webdev@gmail.com"];

      await authMdl.insertOTP({ email, otp });

      if (
        process.env.NODE_ENV === "production" &&
        !bypassEmail.includes(email)
      ) {
        await sendMail(email, otp);

        return sendResponse(res, 200, 1, [], "OTP Sent Successfully", []);
      }

      return sendResponse(res, 200, 1, [{ otp }], "OTP Sent Successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return sendResponse(res, 200, 0, [], "Email and OTP are required", []);
      }

      const otpData = await authMdl.verifyOtp(email, otp);

      if (!otpData) {
        return sendResponse(res, 200, 0, [], "Invalid OTP", []);
      }

      if (otpData.verified === 1) {
        return sendResponse(res, 200, 0, [], "OTP already used", []);
      }

      if (new Date(otpData.expires_at) < new Date()) {
        return sendResponse(res, 200, 0, [], "OTP expired", []);
      }

      await authMdl.markOtpUsed(otpData.id);

      return sendResponse(res, 200, 1, [], "OTP verified successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const {
        user_name,
        email,
        password,
        device_id,
        device_type,
        device_token,
      } = await validateRequest(req.body, signupSchema);

      const userExist = await authMdl.findUserByEmail(email);

      if (userExist) {
        return sendResponse(res, 200, 0, [], "User already exists", []);
      }

      const otpVerified = await authMdl.isEmailVerified(email);

      if (!otpVerified) {
        return sendResponse(res, 200, 0, [], "Please verify OTP first", []);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const customUserId = await createUserId();

      const userId = await authMdl.createUser({
        user_id: customUserId,
        user_name,
        email,
        password: hashedPassword,
        login_type: "normal",
      });

      const token = await generateToken({
        user_id: userId,
        email: email,
        device_id: device_id,
      });

      await authMdl.addUserDevice({
        user_id: userId,
        device_id,
        device_type,
        device_token,
      });
      return sendResponse(
        res,
        200,
        1,
        [{ token, user_id: customUserId }],
        "Signup successful",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }

  static async googleLogin(req: Request, res: Response) {
    try {
      const { google_token, device_id, device_type, device_token } =
        await validateRequest(req.body, googleLoginSchema);

      const ticket = await googleClient.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        return sendResponse(res, 200, 0, [], "Invalid Google token", []);
      }

      const email = payload.email;
      const user_name = payload.name || "";

      let user = await authMdl.findUserByEmail(email);

      let userId: number;

      if (!user) {
        userId = await authMdl.createUser({
          user_name,
          email,
          password: "",
          login_type: "google",
        });
      } else {
        userId = user.id;
      }

      const token = jwt.sign(
        {
          user_id: userId,
          device_id,
          device_type,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30d",
        },
      );

      await authMdl.addUserDevice({
        user_id: userId,
        device_id,
        device_type,
        device_token,
        jwt_token: token,
      });

      return sendResponse(
        res,
        200,
        1,
        [
          {
            user_id: userId,
            token,
          },
        ],
        "Login successful",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password, device_id, device_type, device_token } =
        await validateRequest(req.body, loginSchema);

      const user = await authMdl.findUserByEmail(email);

      if (!user) {
        return sendResponse(res, 200, 0, [], "User not found", []);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return sendResponse(res, 200, 0, [], "Invalid password", []);
      }

      const token = jwt.sign(
        {
          user_id: user.id,
          device_id,
          device_type,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30d",
        },
      );

      await authMdl.addUserDevice({
        user_id: user.id,
        device_id,
        device_type,
        device_token,
        jwt_token: token,
      });

      return sendResponse(
        res,
        200,
        1,
        [
          {
            user_id: user.id,
            token,
          },
        ],
        "Login successful",
        [],
      );
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], "Internal Server Error", [
        err.errors || err.message || err,
      ]);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { email, password } = await validateRequest(
        req.body,
        resetPasswordSchema,
      );

      const verifiedOtp = await authMdl.isEmailVerified(email);

      if (!verifiedOtp) {
        return sendResponse(res, 200, 0, [], "Please verify OTP first", []);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await authMdl.updatePassword(email, hashedPassword);

      return sendResponse(res, 200, 1, [], "Password reset successfully", []);
    } catch (err: any) {
      return sendResponse(res, 500, 0, [], err.message, []);
    }
  }
}
