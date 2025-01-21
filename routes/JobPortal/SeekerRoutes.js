import express from "express";
import { getRecommendedJobs,getProfileData,AddUpdateProfileData } from "../../controllers/jobPortal/SeekerController.js";
import authenticate from "../../middleware/authMiddleware.js";



const router = express.Router();

router.get('/profile',authenticate,getProfileData)
router.get('/recommended-jobs',authenticate, getRecommendedJobs)
router.post('/profile',authenticate,AddUpdateProfileData)

export default router;