import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema for the Course
const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "Course title is required."],
    trim: true,
    minlength: [5, "Title must be at least 5 characters long."],
  },
  description: {
    type: String,
    required: [true, "Course description is required."],
    trim: true,
    minlength: [20, "Description must be at least 20 characters long."],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencing the User model (Instructor)
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Students enrolled in this course
    },
  ],
  price: {
    type: Number,
    required: [true, "Course price is required."],
    min: [0, "Price must be a positive number."],
  },
  duration: {
    type: String,
    required: [true, "Duration is required."], // Example: "5 hours" or "3 weeks"
  },
  image: {
    type: String,
    required: [true, "Course image URL is required."], // URL of the course thumbnail
  },
  category: {
    type: [String],
    required: [true, "At least one category is required."],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Course type is required."],
    enum: ["Live", "Recorded"], // Specifies the course type
  },

  // Live Course Details
  liveDetails: {
    schedule: [
      {
        date: { type: Date, required: function () { return this.type === "Live"; } },
        time: { type: String, required: function () { return this.type === "Live"; } }, // Example: "10:00 AM - 12:00 PM"
      },
    ],
    meetingLink: {
      type: String,
      required: function () {
        return this.type === "Live";
      }, // Required only for live courses
    },
    platform: {
      type: String,
      default: "Zoom", // Example: Zoom, Microsoft Teams, Google Meet
    },
  },

  // Recorded Course Details
  recordings: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String, required: true }, // Secure URL of the recorded video
      duration: { type: String, required: true }, // Example: "10 minutes"
    },
  ],

  // Security for LMS Links
  lmsAccessTokens: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      token: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
  ],

  // Ratings
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },

  // Meta Info
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


courseSchema.methods.addRecording = function (recording) {
  this.recordings.push(recording);
  return this.save();
};


courseSchema.methods.generateLmsAccessToken = function (userId, token, expiryTime) {
  this.lmsAccessTokens.push({
    userId,
    token,
    expiresAt: expiryTime,
  });
  return this.save();
};


courseSchema.methods.verifyLmsAccessToken = function (userId, token) {
  const tokenEntry = this.lmsAccessTokens.find(
    (entry) => entry.userId.toString() === userId.toString() && entry.token === token
  );
  if (!tokenEntry) return false;
  return tokenEntry.expiresAt > new Date();
};

const Course = model("Course", courseSchema);

export default Course;
