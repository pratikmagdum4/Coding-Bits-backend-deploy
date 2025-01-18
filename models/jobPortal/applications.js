const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Job", 
        required: true 
    }, // Reference to the Job
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // Reference to the User (Job Seeker)
    status: { 
        type: String, 
        enum: ["applied", "shortlisted", "rejected"], 
        default: "applied" 
    },
    resume: { 
        type: String,
        match: /^https?:\/\/.*$/ // Ensure a valid URL format
    }, // URL to the applicant's resume
    coverLetter: { 
        type: String 
    }, // Optional cover letter
    appliedAt: { 
        type: Date, 
        default: Date.now 
    },
    history: [
        {
            status: { type: String, enum: ["applied", "shortlisted", "rejected"] },
            updatedAt: { type: Date, default: Date.now },
            comment: { type: String }
        }
    ]
});

// Adding indexes for faster queries
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ userId: 1 });

module.exports = mongoose.model("Applications", applicationSchema);
