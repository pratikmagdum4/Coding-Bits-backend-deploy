import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema for the Student
const studentSchema = new Schema({
  name: {
    type: String,
    required: [true, "Student name is required."],
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
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course", // Reference to the Course schema
    },
  ],
  progress: [
    {
      course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
      completedLessons: { type: Number, default: 0 },
    },
  ],
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
studentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Student model
const Student = model("Student", studentSchema);

export default Student;
