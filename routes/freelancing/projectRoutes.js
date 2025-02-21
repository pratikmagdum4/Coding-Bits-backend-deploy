import express from "express";
import { getAllProjects,deleteProject,updateProject,addUpdateProject,getProjectById } from "../../controllers/freelancing/projectController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import authenticate from "../../middleware/authMiddleware.js";

const router = express.Router();

// Project Routes
router.post("/create-update", authMiddleware, addUpdateProject);  
router.get('/:projectId',authenticate,getProjectById)
router.put('/:projectId',authenticate,updateProject)

export default router;
