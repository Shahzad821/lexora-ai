import express from "express";
import multer from "multer";
import {
  generateArticle,
  generateBlogTitles,
  generateImage,
  getPublishedCreations,
  getUserCreations,
  removeBackground,
  removeObject,
  reviewResume,
  toggleLikeCreation,
} from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/creations", auth, getUserCreations);
router.get("/published-creations", auth, getPublishedCreations);
router.post("/published-creations/:id/like", auth, toggleLikeCreation);

router.post("/generate-article", auth, generateArticle);
router.post("/generate-blog-titles", auth, generateBlogTitles);
router.post("/generate-image", auth, generateImage);
router.post("/remove-background", auth, upload.single("image"), removeBackground);
router.post(
  "/remove-object",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image_file", maxCount: 1 },
    { name: "mask", maxCount: 1 },
    { name: "mask_file", maxCount: 1 },
  ]),
  removeObject,
);
router.post("/review-resume", auth, upload.single("resume"), reviewResume);

export default router;
