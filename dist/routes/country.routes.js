"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const country_controller_1 = require("../controllers/country.controller");
const router = (0, express_1.Router)();
router.post("/add-country", country_controller_1.CountryController.addUpdateCountry);
exports.default = router;
