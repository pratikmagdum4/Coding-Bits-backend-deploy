import { getAllCounts } from "../../controllers/admin/adminCountController.js";

import express from "express";
import authenticate from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get('/allcount',authenticate,getAllCounts)

export default router;