import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema for the Teacher
const teacherSchema = new Schema({
  name: {
    type: String,
    required: [true, "Teacher name is required."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, "Bio cannot exceed 500 characters."],
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course schema
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
});

// Middleware to auto-update the `updatedAt` field
teacherSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate the average rating
teacherSchema.methods.calculateAverageRating = function (newRating) {
  const totalReviews = this.ratings.totalReviews + 1;
  const totalRating =
    this.ratings.average * this.ratings.totalReviews + newRating;
  this.ratings.average = totalRating / totalReviews;
  this.ratings.totalReviews = totalReviews;
  return this.save();
};

// Export the Teacher model
const Teacher = model("Teacher", teacherSchema);

export default Teacher;
