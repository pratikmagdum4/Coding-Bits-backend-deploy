import mongoose from 'mongoose';

const { Schema } = mongoose;

const recruiterSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    company: {
      type: String,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
      trim: true,
    },
    postedJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  { timestamps: true }
);

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export default Recruiter;