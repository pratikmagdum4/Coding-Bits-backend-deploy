import express from "express";
import { getAllRecruiters, getRecruiterById, deleteRecruiter } from "../../../controllers/admin/jobportal/adminRecruiterController.js";
import authenticate from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getAllRecruiters);
router.get("/:id", authenticate, getRecruiterById);
router.delete("/:id", authenticate, deleteRecruiter);

export default router;
