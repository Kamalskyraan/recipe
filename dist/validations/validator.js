"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.loginSchema = exports.googleLoginSchema = exports.signupSchema = exports.addCountrySchema = exports.saveTipSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.saveTipSchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    status: joi_1.default.string().valid("active", "inactive").optional(),
});
exports.addCountrySchema = joi_1.default.object({
    id: joi_1.default.number().integer().optional(),
    image: joi_1.default.string().required().messages({
        "any.required": "Image is required",
    }),
    name: joi_1.default.string().required().messages({
        "any.required": "Name is required",
    }),
    status: joi_1.default.string().valid("active", "inactive").optional(),
});
exports.signupSchema = joi_1.default.object({
    user_name: joi_1.default.string().trim().min(3).max(50).required().messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "any.required": "Username is required",
    }),
    email: joi_1.default.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please enter a valid email",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).max(20).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    device_id: joi_1.default.string().required().messages({
        "any.required": "Device Id is required",
    }),
    device_type: joi_1.default.string().valid("android", "ios").required().messages({
        "any.only": "Device type must be android or ios",
        "any.required": "Device type is required",
        "string.empty": "Device type is required",
    }),
    device_token: joi_1.default.string().allow("", null),
});
exports.googleLoginSchema = joi_1.default.object({
    google_token: joi_1.default.string().required(),
    device_id: joi_1.default.string().required(),
    device_type: joi_1.default.string().valid("android", "ios").required(),
    device_token: joi_1.default.string().allow("", null),
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    device_id: joi_1.default.string().required(),
    device_type: joi_1.default.string().valid("android", "ios").required(),
    device_token: joi_1.default.string().allow("", null),
});
exports.resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(6).required().messages({
        "any.required": "Password is required",
    }),
});
