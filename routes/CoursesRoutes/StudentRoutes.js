import express from "express";
import { AddUpdateStudentProfile ,getStudentProfile,enrollStudentInCourse,getAllStudents} from "../../controllers/courseSection/StudentController.js";
import authenticate from "../../middleware/authMiddleware.js";
const router = express.Router();


router.post('/student/profile',authenticate,AddUpdateStudentProfile)
router.get('/',authenticate,getAllStudents)
router.get('/student/profile/:id',authenticate,getStudentProfile)
router.post('/student/:courseId/enroll',authenticate,enrollStudentInCourse)


export default router;