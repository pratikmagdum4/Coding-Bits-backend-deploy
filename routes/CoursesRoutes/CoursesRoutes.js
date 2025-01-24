import express from "express";
import { getAllCourses } from "../../controllers/courseSection/CoursesController.js";
import authenticate from "../../middleware/authMiddleware.js";
const router = express.Router();


router.get('/all-courses',authenticate,getAllCourses)



export default router;