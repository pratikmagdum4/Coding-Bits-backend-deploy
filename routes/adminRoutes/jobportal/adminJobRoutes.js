import express from "express";
import { getAllJobs, getJobById, updateJob, deleteJob } from "../../../controllers/admin/jobportal/adminJobController.js";
import authenticate from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all admin job routes
router.use(authenticate);

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;

