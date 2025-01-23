import express from "express";
import  {AddJob,updateJob,deleteJob,getJobsByRecruiter,getApplicants,getProfileDataOfApplicant,updateApplicationStatusChange} from "../../controllers/jobPortal/RecruiterController.js";
import authenticate from '../../middleware/authMiddleware.js'
const router = express.Router();

router.post('/jobs', authenticate,AddJob);

router.put('/job/:id', authenticate, updateJob);
router.delete('/jobs/:id', authenticate, deleteJob);
router.get('/jobs', authenticate, getJobsByRecruiter);
router.get('/jobs/:jobId/applicants', authenticate, getApplicants);
router.get('/applicants/:seekerId', authenticate, getProfileDataOfApplicant);
router.put('/applications/:applicationId', authenticate, updateApplicationStatusChange);

export default router;
