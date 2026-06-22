"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const src_routes_1 = __importDefault(require("./src.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/src", src_routes_1.default);
// img
router.post("/upload", multer_1.upload.single("file"), (req, res) => {
    res.json({
        message: "File uploaded",
        file: req.file,
    });
});
router.post("/upload-multiple", multer_1.upload.array("files", 5), (req, res) => {
    res.json({
        message: "Files uploaded",
        // files: req.files,
    });
});
exports.default = router;
