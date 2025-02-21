import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  addCourseToTeacher,
  updateTeacherRating,
} from "../../../controllers/admin/courseSection/adminTeacherController.js"

const router = express.Router();

// Teacher routes
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);
router.post("/:id/courses", addCourseToTeacher);
router.post("/:id/ratings", updateTeacherRating);

export default router;