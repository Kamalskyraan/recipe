import { Router } from "express";
import { CountryController } from "../controllers/country.controller";

const router = Router();

router.post("/add-country", CountryController.addUpdateCountry);



export default router;
