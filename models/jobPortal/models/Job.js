// Job Scheme Model

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    skillsRequired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    salary: { type: Number },
    postedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

// Create the Job model from the schema
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
