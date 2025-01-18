const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" }, // 'recruiter' or 'job_seeker'
  profilePicture: { type: String }, // URL to profile picture
  bio: { type: String }, // Short bio for job seekers
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model("User", userSchema);
