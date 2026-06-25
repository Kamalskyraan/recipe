import { Request, Response, Router } from "express";
import srcRoutes from "./src.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import { upload } from "../config/multer";
import { UploadController } from "../controllers/src.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/src", srcRoutes);
router.use("/user", userRoutes);

// img

router.post(
  "/upload",

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
  upload.array("files", 10),
  UploadController.upload,
);

router.post(
  "/get-uploads",

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
  UploadController.getUploads,
);

export default router;
