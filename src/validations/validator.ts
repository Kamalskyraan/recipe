import Joi from "joi";

export const saveTipSchema = Joi.object({
  id: Joi.number().integer().optional(),

  status: Joi.string().valid("active", "inactive").optional(),
});

export const addCountrySchema = Joi.object({
  id: Joi.number().integer().optional(),
  image: Joi.string().required().messages({
    "any.required": "Image is required",
  }),
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  status: Joi.string().valid("active", "inactive").optional(),
});

export const signupSchema = Joi.object({
  user_name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "any.required": "Username is required",
  }),

  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).max(20).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  device_id: Joi.string().required().messages({
    "any.required": "Device Id is required",
  }),
  device_type: Joi.string().valid("android", "ios").required().messages({
    "any.only": "Device type must be android or ios",
    "any.required": "Device type is required",
    "string.empty": "Device type is required",
  }),
  device_token: Joi.string().allow("", null),
});

export const googleLoginSchema = Joi.object({
  google_token: Joi.string().required(),
  device_id: Joi.string().required(),
  device_type: Joi.string().valid("android", "ios").required(),
  device_token: Joi.string().allow("", null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  device_id: Joi.string().required(),
  device_type: Joi.string().valid("android", "ios").required(),
  device_token: Joi.string().allow("", null),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),

  password: Joi.string().min(6).required().messages({
    "any.required": "Password is required",
  }),
});
