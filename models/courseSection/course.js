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
    type: String,
    required: [true, "Instructor name is required."],
    trim: true,
  },
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
  liveDetails: {
    schedule: [
      {
        date: { type: Date, required: true },
        time: { type: String, required: true }, // Example: "10:00 AM - 12:00 PM"
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
      default: "Zoom", // Example: Zoom, Microsoft Teams, etc.
    },
  },
  recordings: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String, required: true }, // URL of the recorded video
      duration: { type: String, required: true }, // Example: "10 minutes"
    },
  ],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
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
});


// Middleware to auto-update the `updatedAt` field
courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add a new recording
courseSchema.methods.addRecording = function (recording) {
  this.recordings.push(recording);
  return this.save();
};

const Course = model("Course", courseSchema);

export default Course;
