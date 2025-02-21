import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudentInCourse,
  updateStudentProgress,
} from '../../../controllers/admin/courseSection/adminStudentController.js'

const router = express.Router();

// Student routes
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.post("/:id/enroll", enrollStudentInCourse);
router.put("/:id/progress", updateStudentProgress);

export default router;