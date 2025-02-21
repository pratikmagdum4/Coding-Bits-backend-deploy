import Job from "../../../models/jobPortal/job.js";
import { body, param, validationResult } from 'express-validator';
import User from "../../../models/userModel.js";  // Make sure the path is correct
// import Job from "../../models/jobModel.js";    // Also, ensure the Job model is imported


// Validation rules for creating/updating a job
const jobValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('salary').isFloat({ min: 0 }).withMessage('Salary must be a non-negative number'),
];

// Validation rule for job ID
const jobIdValidationRule = [
  param('id').isMongoId().withMessage('Invalid job ID'),
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get job by ID
export const getJobById = [
  ...jobIdValidationRule,
  validate,
  async (req, res) => {
    // console.log("req.params.id", req)
    try {
      // console.log("req.params.id", req.params.id)
      const job = await Job.findById(req.params.id)
      // console.log("job", job)
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.status(200).json(job);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid job ID format" });
      }
      res.status(500).json({ message: "Server Error", error });
    }
  }
];

// Edit job details
export const updateJob = [
  ...jobIdValidationRule,
  ...jobValidationRules,
  validate,
  async (req, res) => {
    try {
      const updates = (({ title, description, location, salary }) => ({ title, description, location, salary }))(req.body);
      const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.status(200).json(job);
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid job ID format" });
      }
      res.status(500).json({ message: "Server Error", error });
    }
  }
];

// Delete job
export const deleteJob = [
  ...jobIdValidationRule,
  validate,
  async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid job ID format" });
      }
      res.status(500).json({ message: "Server Error", error });
    }
  }
];

