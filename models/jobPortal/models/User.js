// User Schema for Job Portal

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['job_seeker', 'employer'], required: true },
    profile: {
        phone: { type: String },
        location: { type: String },
        skills: [{ type: String }]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Creating the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
