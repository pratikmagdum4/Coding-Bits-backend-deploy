import express from "express";

import { getAllClients, getClientById, deleteClient } from "../../../controllers/admin/freelancing/adminClientController.js";
import { getProjectById, updateProject, removeFreelancerFromProject, deleteProject } from "../../../controllers/admin/freelancing/adminProjectController.js";
import { getAllFreelancers, getFreelancerById, deleteFreelancer } from "../../../controllers/admin/freelancing/adminFreelancerController.js";
import authenticate from "../../../middleware/authMiddleware.js";
const router = express.Router();

// Client Routes
router.get("/clients", authenticate, getAllClients);
router.get("/clients/:id", authenticate, getClientById);
router.delete("/clients/:id", authenticate, deleteClient);

// Project Routes
router.get("/projects/:id", authenticate, getProjectById);
router.put("/projects/:id", authenticate, updateProject);
router.put("/projects/:id/remove-freelancer", authenticate, removeFreelancerFromProject);
router.delete("/projects/:id", authenticate, deleteProject);

// Freelancer Routes
router.get("/freelancers", authenticate, getAllFreelancers);
router.get("/freelancers/:id", authenticate, getFreelancerById);
router.delete("/freelancers/:id", authenticate, deleteFreelancer);

export default router;
