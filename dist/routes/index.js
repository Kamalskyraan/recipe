"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const src_routes_1 = __importDefault(require("./src.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const multer_1 = require("../config/multer");
const src_controller_1 = require("../controllers/src.controller");
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/src", src_routes_1.default);
router.use("/user", user_routes_1.default);
// img
router.post("/upload", 
/*
    #swagger.tags = ['1.Upload']
    #swagger.summary = 'Upload Files'
    #swagger.description = 'Upload single or multiple images, videos, and PDF files'

    #swagger.consumes = ['multipart/form-data']

    #swagger.parameters['files'] = {
      in: 'formData',
      type: 'file',
      required: true,
      description: 'Select one or more files'
    }

    #swagger.responses[200] = {
      description: 'Files Uploaded Successfully'
    }

    #swagger.responses[400] = {
      description: 'No files uploaded'
    }
*/
multer_1.upload.array("files", 10), src_controller_1.UploadController.upload);
router.post("/get-uploads", 
/*
    #swagger.tags = ['1.Upload']
    #swagger.summary = 'Get Uploaded Files'
    #swagger.description = 'Fetch uploaded images, videos, PDFs with pagination and filters'

    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        page: 1,
        limit: 10,
        media_type: 'image',
        id: '1,2,3'
      }
    }

   

    

    #swagger.responses[500] = {
      description: 'Internal Server Error',
      schema: {
        success: 0,
        data: [],
        message: 'Something went wrong'
      }
    }
*/
src_controller_1.UploadController.getUploads);
exports.default = router;
