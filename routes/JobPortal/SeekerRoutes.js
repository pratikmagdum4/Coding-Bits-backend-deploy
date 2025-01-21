import express from "express";
import { getRecommendedJobs,getProfileData,AddUpdateProfileData,applyToJob,getAppliedJobs } from "../../controllers/jobPortal/SeekerController.js";
import authenticate from "../../middleware/authMiddleware.js";



const router = express.Router();

router.get('/profile',authenticate,getProfileData)
router.get('/recommended-jobs',authenticate, getRecommendedJobs)
router.post('/profile',authenticate,AddUpdateProfileData)
router.post('/jobs/:jobId/apply',authenticate,applyToJob)
router.get('/applied-jobs',authenticate,getAppliedJobs)
export default router;