"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = promise_1.default.createPool({
    host: "localhost",
    user: "skyraantech_food_recipe",
    password: "@eROf?=Nf!X?1W{y",
    database: "skyraantech_food_recipe_db",
    connectionLimit: 10,
});
// export const db = mysql.createPool({
//   host: "localhost",
//   user: process.env.USER || "root",
//   password: process.env.PASSWORD || "",
//   database: process.env.DB || "recipe",
//   connectionLimit: 10,
// });
