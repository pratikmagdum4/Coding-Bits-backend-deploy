import mongoose from 'mongoose';

const { Schema } = mongoose;

const jobSeekerSchema = new Schema(
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
    skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    resume: {
      type: String,
      validate: {
        validator: (url) => {
          const urlRegex = /^(https?:\/\/)?([\w\d\-]+\.)+[\w]{2,}(\/?.*)$/;
          return urlRegex.test(url);
        },
        message: 'Resume must be a valid URL',
      },
    },
    appliedJobs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'JobApplication',
      },
    ],
  },
  { timestamps: true }
);

const JobSeeker = mongoose.model('JobSeeker', jobSeekerSchema);

export default JobSeeker;