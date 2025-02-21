import express from "express";
import { generateLmsToken, verifyLmsToken, getLmsLinks } from "../controllers/lmsController.js";
import authenticate from "../middleware/authMiddleware.js"; // Protect routes

const router = express.Router();

router.post("/generate-token", authenticate, generateLmsToken);
router.post("/verify-token", authenticate, verifyLmsToken);
router.get("/get-links/:courseId", authenticate, getLmsLinks);

export default router;
