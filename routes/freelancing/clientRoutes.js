import express from "express";
import { addUpdateClientProfile,addProject,getProjectsByClient } from "../../controllers/freelancing/clientController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import authenticate from "../../middleware/authMiddleware.js";

const router = express.Router();

// Client Profile Routes
router.post("/profile", authMiddleware, addUpdateClientProfile);  // Create or Update profile
router.post('/createProject',authenticate,addProject)
router.get('/getProjects',authenticate,getProjectsByClient)

export default router;
