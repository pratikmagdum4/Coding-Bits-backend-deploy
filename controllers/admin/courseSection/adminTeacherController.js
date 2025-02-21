import Teacher from "../../../models/courseSection/teacher.js";
import { param, validationResult, body } from "express-validator";

// Validation rule for teacher ID
const teacherIdValidation = [
  param("id").isMongoId().withMessage("Invalid teacher ID"),
];

// Validation rule for creating/updating a teacher
const teacherValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Teacher name is required.")
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
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters."),
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("courses");
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a teacher by ID
export const getTeacherById = [
  ...teacherIdValidation,
  validate,
  async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id).populate("courses");
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(200).json(teacher);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Create a new teacher
export const createTeacher = [
  ...teacherValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, password, bio } = req.body;
      const newTeacher = new Teacher({ name, email, password, bio });
      await newTeacher.save();
      res.status(201).json({ message: "Teacher created successfully", newTeacher });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Update a teacher by ID
export const updateTeacher = [
  ...teacherIdValidation,
  ...teacherValidation,
  validate,
  async (req, res) => {
    try {
      const { name, email, password, bio } = req.body;
      const updatedTeacher = await Teacher.findByIdAndUpdate(
        req.params.id,
        { name, email, password, bio, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!updatedTeacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(200).json({ message: "Teacher updated successfully", updatedTeacher });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Delete a teacher by ID
export const deleteTeacher = [
  ...teacherIdValidation,
  validate,
  async (req, res) => {
    try {
      const teacher = await Teacher.findByIdAndDelete(req.params.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Add a course to a teacher
export const addCourseToTeacher = [
  ...teacherIdValidation,
  body("courseId")
    .isMongoId()
    .withMessage("Invalid course ID"),
  validate,
  async (req, res) => {
    try {
      const { courseId } = req.body;
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      teacher.courses.push(courseId);
      await teacher.save();
      res.status(200).json({ message: "Course added to teacher successfully", teacher });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];

// Update a teacher's rating
export const updateTeacherRating = [
  ...teacherIdValidation,
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  validate,
  async (req, res) => {
    try {
      const { rating } = req.body;
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
      await teacher.calculateAverageRating(rating);
      res.status(200).json({ message: "Teacher rating updated successfully", teacher });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
];