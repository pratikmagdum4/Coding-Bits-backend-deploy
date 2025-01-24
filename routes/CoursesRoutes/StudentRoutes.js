import express from "express";
import { AddUpdateStudentProfile ,getStudentProfile} from "../../controllers/courseSection/StudentController.js";
import authenticate from "../../middleware/authMiddleware.js";
const router = express.Router();


router.post('/student/profile',authenticate,AddUpdateStudentProfile)
router.get('/student/profile',authenticate,getStudentProfile)


export default router;