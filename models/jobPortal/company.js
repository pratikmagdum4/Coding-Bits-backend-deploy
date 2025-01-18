const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email validation
        },
        website: { 
            type: String, 
            match: /^https?:\/\/.*$/ // Ensure valid URL format
        },
        description: { 
            type: String, 
            maxlength: 1000 
        },
        logo: { 
            type: String, 
            default: "https://example.com/default-logo.png" 
        }, // URL to company logo
        jobsPosted: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Job" 
            }
        ] // Jobs posted by the company
    },
    { timestamps: true } // Auto-add createdAt and updatedAt
);

// Add indexes
companySchema.index({ email: 1 });
companySchema.index({ name: 1 });

module.exports = mongoose.model("Company", companySchema);
