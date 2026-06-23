"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserId = exports.verifyToken = exports.generateToken = exports.sendResponse = exports.validateRequest = void 0;
exports.executeQuery = executeQuery;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const validateRequest = (data, schema) => {
    const { error, value } = schema.validate(data, {
        abortEarly: true,
        allowUnknown: true,
    });
    if (error) {
        const errorMessages = error.details.map((err) => err.message).join(", ");
        const errorObject = new Error("Validation Error");
        errorObject.status = 200;
        errorObject.errors = errorMessages;
        throw errorObject;
    }
    return value;
};
exports.validateRequest = validateRequest;
const sendResponse = (res, statusCode, success, data = [], message = "", error = []) => {
    return res.status(statusCode).json({
        success,
        data,
        message,
        error,
    });
};
exports.sendResponse = sendResponse;
async function executeQuery(sql, params = {}) {
    try {
        const [results] = await db_1.db.query(sql, params);
        return results;
    }
    catch (error) {
        throw error;
    }
}
const generateToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "90d",
    });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
};
exports.verifyToken = verifyToken;
const createUserId = () => {
    return `USR${Date.now()}${Math.floor(Math.random() * 1000)}`;
};
exports.createUserId = createUserId;
