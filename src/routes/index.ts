import { Request, Response, Router } from "express";
import srcRoutes from "./src.routes";
import authRoutes from "./auth.routes";
import { upload } from "../config/multer";
import UploadController from "../controllers/src.controller";
const router = Router();

router.use("/auth", authRoutes);
router.use("/src", srcRoutes);

// img

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  res.json({
    message: "File uploaded",
    file: req.file,
  });
});

router.post("/upload-multiple", upload.array("files", 5), (req, res) => {
  res.json({
    message: "Files uploaded",
    // files: req.files,
  });
});

export default router;
