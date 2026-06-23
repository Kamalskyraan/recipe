"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const helper_1 = require("../utils/helper");
const auth_model_1 = require("../models/auth.model");
const email_1 = require("../services/email");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const validator_1 = require("../validations/validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const authMdl = new auth_model_1.AuthModel();
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthController {
    static async createGuest(req, res) {
        try {
            const { device_id, country, food_type, prefer_lang } = req.body;
            const existingGuest = await authMdl.findGuestByDevice(device_id);
            if (existingGuest) {
                return (0, helper_1.sendResponse)(res, 200, 1, {
                    user_id: existingGuest.user_id,
                    country: existingGuest.country,
                    food_type: existingGuest.food_type,
                    prefer_lang: existingGuest.prefer_lang,
                }, "Guest Already Exists", []);
            }
            const tempUserId = `TEMP_${Date.now().toString().slice(-3)}${device_id.toString().slice(-2)}${Math.floor(100 + Math.random() * 900)}`;
            await authMdl.createGuest({
                user_id: tempUserId,
                device_id,
                country,
                food_type,
                prefer_lang,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, {
                user_id: tempUserId,
            }, "Guest Created", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message, []);
        }
    }
    static async requestOtp(req, res) {
        try {
            const { email, type } = req.body;
            if (!email) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Email is required", []);
            }
            const user = await authMdl.findUserByEmail(email);
            if (type === "1") {
                if (user) {
                    return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists", []);
                }
            }
            if (type === "2") {
                if (!user) {
                    return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
                }
            }
            let otp = Math.floor(1000 + Math.random() * 9000).toString();
            const bypassEmail = ["abc@gmail.com", "kamalesh.webdev@gmail.com"];
            await authMdl.insertOTP({ email, otp });
            if (process.env.NODE_ENV === "production" &&
                !bypassEmail.includes(email)) {
                await (0, email_1.sendMail)(email, otp);
                return (0, helper_1.sendResponse)(res, 200, 1, [], "OTP Sent Successfully", []);
            }
            return (0, helper_1.sendResponse)(res, 200, 1, [{ otp }], "OTP Sent Successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message, []);
        }
    }
    static async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Email and OTP are required", []);
            }
            const otpData = await authMdl.verifyOtp(email, otp);
            if (!otpData) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid OTP", []);
            }
            if (otpData.verified === 1) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "OTP already used", []);
            }
            if (new Date(otpData.expires_at) < new Date()) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "OTP expired", []);
            }
            await authMdl.markOtpUsed(otpData.id);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "OTP verified successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message, []);
        }
    }
    static async signup(req, res) {
        try {
            const { user_name, email, password, device_id, device_type, device_token, } = await (0, helper_1.validateRequest)(req.body, validator_1.signupSchema);
            const userExist = await authMdl.findUserByEmail(email);
            if (userExist) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User already exists", []);
            }
            const otpVerified = await authMdl.isEmailVerified(email);
            if (!otpVerified) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Please verify OTP first", []);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const customUserId = await (0, helper_1.createUserId)();
            const userId = await authMdl.createUser({
                user_id: customUserId,
                user_name,
                email,
                password: hashedPassword,
                login_type: "normal",
            });
            const token = await (0, helper_1.generateToken)({
                user_id: userId,
                email: email,
                device_id: device_id,
            });
            await authMdl.addUserDevice({
                user_id: customUserId,
                device_id,
                device_type,
                device_token,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [{ token, user_id: customUserId }], "Signup successful", []);
        }
        catch (err) {
            console.log(err);
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors || err.message || err,
            ]);
        }
    }
    static async googleLogin(req, res) {
        try {
            const { google_token, device_id, device_type, device_token } = await (0, helper_1.validateRequest)(req.body, validator_1.googleLoginSchema);
            const ticket = await googleClient.verifyIdToken({
                idToken: google_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid Google token", []);
            }
            const email = payload.email;
            const user_name = payload.name || "";
            let user = await authMdl.findUserByEmail(email);
            let userId;
            if (!user) {
                userId = await authMdl.createUser({
                    user_name,
                    email,
                    password: "",
                    login_type: "google",
                });
            }
            else {
                userId = user.id;
            }
            const token = jsonwebtoken_1.default.sign({
                user_id: userId,
                device_id,
                device_type,
            }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            await authMdl.addUserDevice({
                user_id: userId,
                device_id,
                device_type,
                device_token,
                jwt_token: token,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [
                {
                    user_id: userId,
                    token,
                },
            ], "Login successful", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message, []);
        }
    }
    static async login(req, res) {
        try {
            const { email, password, device_id, device_type, device_token } = await (0, helper_1.validateRequest)(req.body, validator_1.loginSchema);
            const user = await authMdl.findUserByEmail(email);
            if (!user) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "User not found", []);
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Invalid password", []);
            }
            const token = jsonwebtoken_1.default.sign({
                user_id: user.id,
                device_id,
                device_type,
            }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            await authMdl.addUserDevice({
                user_id: user.id,
                device_id,
                device_type,
                device_token,
                jwt_token: token,
            });
            return (0, helper_1.sendResponse)(res, 200, 1, [
                {
                    user_id: user.id,
                    token,
                },
            ], "Login successful", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", [
                err.errors || err.message || err,
            ]);
        }
    }
    static async resetPassword(req, res) {
        try {
            const { email, password } = await (0, helper_1.validateRequest)(req.body, validator_1.resetPasswordSchema);
            const verifiedOtp = await authMdl.isEmailVerified(email);
            if (!verifiedOtp) {
                return (0, helper_1.sendResponse)(res, 200, 0, [], "Please verify OTP first", []);
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            await authMdl.updatePassword(email, hashedPassword);
            return (0, helper_1.sendResponse)(res, 200, 1, [], "Password reset successfully", []);
        }
        catch (err) {
            return (0, helper_1.sendResponse)(res, 500, 0, [], err.message, []);
        }
    }
}
exports.AuthController = AuthController;
