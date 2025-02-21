//Creating routes for admin
import express from "express";
import {
  getCourses,
  updateCourse,
  deleteCourse,
  createCourse,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getCourseById
} from "../../../controllers/admin/courseSection/adminCourseSectionController.js";

import authenticate from "../../../middleware/authMiddleware.js";

const router = express.Router();

//routes for courses
router.get("/getCourses", authenticate, getCourses);
router.get("/getCourse/:courseId", authenticate, getCourseById);
router.post("/createCourse", authenticate, createCourse);
router.put("/updateCourse/:id", authenticate, updateCourse);
router.delete("/deleteCourse/:id", authenticate, deleteCourse);

//routes for students
router.get("/getStudents", authenticate, getStudents);
router.post("/createStudent", authenticate, createStudent);
router.put("./updateStudent/:id", authenticate, updateStudent);
router.delete("/deleteStudent/:id", authenticate, deleteStudent);

//routers for teachers
router.get("/getTeacher", authenticate, getTeachers);
router.post("/createTeacher", authenticate, createTeacher);
router.put("/updateTeacher/:id", authenticate, updateTeacher);
router.delete("/deleteTeacher/:id", authenticate, deleteTeacher);

export default router;
