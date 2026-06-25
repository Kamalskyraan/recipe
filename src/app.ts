import express from "express";
import dotenv from "dotenv";
import router from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger-output.json";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
