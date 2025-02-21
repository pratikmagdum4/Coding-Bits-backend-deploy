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
    rateCompletedProject 
} from '../../controllers/freelancing/freelancerController.js';

const router = express.Router();


router.post('/profile', createFreelancerProfile);
router.get('/profile/:id', getFreelancerProfile);
router.put('/profile/:id', updateFreelancerProfile);
router.delete('/profile/:id', deleteFreelancerProfile);
router.get('/projects', browseProjects);
router.get('/applied-projects/:id', getAppliedProjects);
router.get('/assigned-projects/:id', getAssignedProjects);
router.post('/rate-project/:id', rateCompletedProject);

export default router;
