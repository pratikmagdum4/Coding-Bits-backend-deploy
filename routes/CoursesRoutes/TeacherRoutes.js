import express from "express";
import {
  addCourseByTeacher,
  updateCourse,
  getCourseById,
  deleteCourse,
  AddUpdateTeacherProfile,getTeacherProfile,getEnrolledStudents,getAllCoursesByTeacher
} from "../../controllers/courseSection/TeacherController.js";
import authenticate from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/courses", authenticate, addCourseByTeacher);
router.post("/teacher/profile", authenticate, AddUpdateTeacherProfile);

router.put("/courses/:id", authenticate, updateCourse);

router.get("/courses", authenticate,getAllCoursesByTeacher);

router.get("/courses/:id", authenticate,getCourseById);

router.get("/teacher/profile", authenticate,getTeacherProfile);
router.get("/course/:courseId/students", authenticate,getEnrolledStudents);

router.delete("/courses/:id", authenticate, deleteCourse);



export default router;
