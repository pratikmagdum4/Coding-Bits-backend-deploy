// routes/freelancerRoutes.js
import express from 'express';
import { 
    createFreelancerProfile,
    getFreelancerProfile,
    updateFreelancerProfile,
    deleteFreelancerProfile,
    browseProjects,
    getAppliedProjects,
    getAssignedProjects,
    rateCompletedProject ,
    AddUpdateFreelancerProfile,
    applyForJob
} from '../../controllers/freelancing/freelancerController.js';
import authenticate from '../../middleware/authMiddleware.js';
const router = express.Router();


// router.post('/profile', createFreelancerProfile);
router.post('/profile', authenticate,AddUpdateFreelancerProfile);
router.post('/project/:projectId/apply', authenticate,applyForJob);
router.get('/profile',authenticate,getFreelancerProfile);
router.put('/profile/:id',authenticate, updateFreelancerProfile);
router.delete('/profile/:id',authenticate, deleteFreelancerProfile);
router.get('/projects',authenticate, browseProjects);
router.get('/applied-projects', authenticate,getAppliedProjects);
router.get('/assigned-projects/:id',authenticate, getAssignedProjects);
router.post('/rate-project/:id', authenticate,rateCompletedProject);

export default router;
