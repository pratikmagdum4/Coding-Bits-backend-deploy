import express from "express";
import { getAllJobSeekers, getJobSeekerById, deleteJobSeeker, deleteJobApplication, removeSeekerFromJob } from "../../../controllers/admin/jobportal/adminJobSeekerController.js";
import authenticate from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Fetch all job seekers
router.get("/", authenticate, getAllJobSeekers);

// Fetch a specific job seeker by ID
router.get("/:seekerId", authenticate, getJobSeekerById);

// Delete a job application for a job seeker
router.delete("/:seekerId/applications/:jobId", authenticate, deleteJobApplication);

// Delete a job seeker
router.delete("/:seekerId", authenticate, deleteJobSeeker);

// Remove job seeker from job application
router.delete("/:jobId/applications/:seekerId", authenticate, removeSeekerFromJob);


export default router;
