import express from "express"
import { getJobById } from "../../controllers/jobPortal/JobController.js"
import authenticate from "../../middleware/authMiddleware.js";
const router = express.Router();

router.get('/job/:id',authenticate,getJobById);

export default router;