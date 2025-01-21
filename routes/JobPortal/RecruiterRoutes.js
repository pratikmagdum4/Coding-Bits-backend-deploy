import express from "express";
import  {AddJob,updateJob,deleteJob,getJobsByRecruiter} from "../../controllers/jobPortal/RecruiterController.js";
import authenticate from '../../middleware/authMiddleware.js'
const router = express.Router();

router.post('/jobs', authenticate,AddJob);

router.put('/job/:id', authenticate, updateJob);
router.delete('/jobs/:id', authenticate, deleteJob);
router.get('/jobs', authenticate, getJobsByRecruiter);

export default router;
