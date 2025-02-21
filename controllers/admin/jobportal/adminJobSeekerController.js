import JobSeeker from "../../../models/jobPortal/jobSeeker.js";
import Job from "../../../models/jobPortal/job.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

// Middleware for validating ObjectId
const validateObjectId = (id) => mongoose.isValidObjectId(id);

// Function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => err.msg) });
  }
};

// Get all job seekers
export const getAllJobSeekers = async (req, res) => {
  try {
    const seekers = await JobSeeker.find();
    res.status(200).json(seekers);
  } catch (error) {
    console.error("Error fetching job seekers:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get job seeker by ID
export const getJobSeekerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid Job Seeker ID" });
    }

    const seeker = await JobSeeker.findById(id).populate({
      path: "applications",
      select: "title company location status",
    });

    if (!seeker) return res.status(404).json({ message: "Job Seeker not found" });

    res.status(200).json(seeker);
  } catch (error) {
    console.error("Error fetching job seeker by ID:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete job seeker
export const deleteJobSeeker = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid Job Seeker ID" });
    }

    const seeker = await JobSeeker.findByIdAndDelete(id);
    if (!seeker) return res.status(404).json({ message: "Job Seeker not found" });

    res.status(200).json({ message: "Job Seeker deleted successfully" });
  } catch (error) {
    console.error("Error deleting job seeker:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a job application for a job seeker
export const deleteJobApplication = async (req, res) => {
  try {
    const { seekerId, jobId } = req.params;

    if (!validateObjectId(seekerId)) {
      return res.status(400).json({ message: "Invalid Job Seeker ID" });
    }
    if (!validateObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const seeker = await JobSeeker.findById(seekerId);
    if (!seeker) {
      return res.status(404).json({ message: "Job Seeker not found" });
    }

    seeker.applications.pull(jobId);
    await seeker.save();

    res.status(200).json({ message: "Job application deleted successfully" });
  } catch (error) {
    console.error("Error deleting job application:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Remove job seeker from job application
export const removeSeekerFromJob = async (req, res) => {
  try {
    const { jobId, seekerId } = req.params;

    if (!validateObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }
    if (!validateObjectId(seekerId)) {
      return res.status(400).json({ message: "Invalid Job Seeker ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.applications.pull(seekerId);
    await job.save();

    res.status(200).json({ message: "Seeker removed from job application successfully" });
  } catch (error) {
    console.error("Error removing seeker from job application:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
