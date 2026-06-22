import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
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
//   database: process.env.DB || "recipe_app",
//   connectionLimit: 10,
// });
