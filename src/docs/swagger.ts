const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Recipe API",
    description: "Recipe Application API",
  },
  // host: "localhost:5001/api",
  host: "food-recipe.skyraantech.com/server/api",
  // schemes: ["http"],
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
