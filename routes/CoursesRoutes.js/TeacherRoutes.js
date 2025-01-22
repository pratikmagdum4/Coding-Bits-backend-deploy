import express from "express";
import {
  addCourseByTeacher,
  updateCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
} from "../../controllers/courseSection/TeacherController.js";
import { authenticateTeacher } from "../middleware/authMiddleware.js"; // Middleware to authenticate teachers

const router = express.Router();

// Route to add a course by a teacher
router.post("/courses", authenticateTeacher, addCourseByTeacher);

// Route to update a course
router.put("/courses/:id", authenticateTeacher, updateCourse);

// Route to get all courses
router.get("/courses", getAllCourses);

// Route to get a course by ID
router.get("/courses/:id", getCourseById);

// Route to delete a course
router.delete("/courses/:id", authenticateTeacher, deleteCourse);

export default router;