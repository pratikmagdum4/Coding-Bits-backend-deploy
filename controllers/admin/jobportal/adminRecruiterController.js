import Recruiter from "../../../models/jobPortal/recruiter.js";
import { param, validationResult } from "express-validator";

// Validation rule for recruiter ID
const recruiterIdValidation = [
  param("id").isMongoId().withMessage("Invalid recruiter ID"),
];

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Get all recruiters
export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().populate("jobs");
    res.status(200).json(recruiters);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getRecruiterById = [
  ...recruiterIdValidation,
  validate,
  async (req, res) => {
    try {
      const recruiter = await Recruiter.findById(req.params.id).populate("jobs");
      if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
      res.status(200).json(recruiter);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
];

// Delete recruiter
export const deleteRecruiter = [
  ...recruiterIdValidation,
  validate,
  async (req, res) => {
    try {
      const recruiter = await Recruiter.findByIdAndDelete(req.params.id);
      if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
      res.status(200).json({ message: "Recruiter deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
];
