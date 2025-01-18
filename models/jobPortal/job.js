const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    skillsRequired: {
      type: [String],
      default: [],
      validate: {
        validator: (skills) => Array.isArray(skills) && skills.length > 0,
        message: "At least one skill must be provided",
      },
    },
    location: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: [true, "PostedBy (Recruiter ID) is required"],
    },

    salaryRange: { 
      type: String, 
      required: false, 
      match: [/^\d+-\d+$/, "Salary range must be in the format 'min-max'"], 
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobApplication",
      },
    ],
    },
    datePosted: {
      type: Date,
      default: Date.now,
    },
    status: { 
      type: String, 
      enum: ["active", "closed"], 
      default: "active" }, // Job status - active or closed
    companyLogo: { 
      type: String
     }, // URL to company logo
    matchCriteria: {
      type: [String],
      default: [],
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
