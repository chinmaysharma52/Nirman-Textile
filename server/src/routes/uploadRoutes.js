import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    
    // Normalize path separators to forward slashes for URLs
    const imagePath = req.file.path.replace(/\\/g, "/");
    res.json({
      message: "Image uploaded successfully",
      imageUrl: `http://localhost:5000/${imagePath}`,
    });
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
