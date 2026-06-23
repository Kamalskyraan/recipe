import jwt from "jsonwebtoken";
import Joi from "joi";
import { ValidationError } from "../interfaces/src.interface";
import { Response } from "express";
import { db } from "../config/db";

export const validateRequest = (data: any, schema: Joi.ObjectSchema): any => {
  const { error, value } = schema.validate(data, {
    abortEarly: true,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message).join(", ");

    const errorObject: ValidationError = new Error("Validation Error");
    errorObject.status = 200;
    errorObject.errors = errorMessages;

    throw errorObject;
  }

  return value;
};

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: number,
  data: any = [],
  message: string = "",
  error: any = [],
) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
    error,
  });
};

export async function executeQuery(
  sql: string,
  params: Record<string, any> = {},
): Promise<any> {
  try {
    const [results] = await db.query(sql, params);
    return results;
  } catch (error) {
    throw error;
  }
}

export const generateToken = (payload: object): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "90d",
  });
  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export const createUserId = (): string => {
  return `USR${Date.now()}${Math.floor(Math.random() * 1000)}`;
};
