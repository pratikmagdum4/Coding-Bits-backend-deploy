import Student from "../../../models/courseSection/student.js";
import { param, validationResult, body } from "express-validator";

// Validation rule for student ID
const studentIdValidation = [
  param("id").isMongoId().withMessage("Invalid student ID"),
];

// Validation rule for creating/updating a student
const studentValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Student name is required.")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("enrolledCourses");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a student by ID
export const getStudentById = [
  ...studentIdValidation,
  validate,
  async (req, res) => {
    try {
      const student = await Student.findById(req.params.id).populate("enrolledCourses");
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Create a new student
export const createStudent = [
  ...studentValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const newStudent = new Student({ name, email, password });
      await newStudent.save();
      res.status(201).json({ message: "Student created successfully", newStudent });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Update a student by ID
export const updateStudent = [
  ...studentIdValidation,
  ...studentValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { name, email, password, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json({ message: "Student updated successfully", updatedStudent });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Delete a student by ID
export const deleteStudent = [
  ...studentIdValidation,
  validate,
  async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Enroll a student in a course
export const enrollStudentInCourse = [
  ...studentIdValidation,
  body("courseId")
    .isMongoId()
    .withMessage("Invalid course ID"),
  validate,
  async (req, res) => {
    try {
      const { courseId } = req.body;
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      if (student.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ message: "Student is already enrolled in this course" });
      }
      student.enrolledCourses.push(courseId);
      student.progress.push({ course: courseId, completedLessons: 0 });
      await student.save();
      res.status(200).json({ message: "Student enrolled in course successfully", student });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Update student progress in a course
export const updateStudentProgress = [
  ...studentIdValidation,
  body("courseId")
    .isMongoId()
    .withMessage("Invalid course ID"),
  body("completedLessons")
    .isInt({ min: 0 })
    .withMessage("Completed lessons must be a non-negative integer"),
  validate,
  async (req, res) => {
    try {
      const { courseId, completedLessons } = req.body;
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      const courseProgress = student.progress.find(
        (progress) => progress.course.toString() === courseId
      );
      if (!courseProgress) {
        return res.status(404).json({ message: "Student is not enrolled in this course" });
      }
      courseProgress.completedLessons = completedLessons;
      await student.save();
      res.status(200).json({ message: "Student progress updated successfully", student });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];