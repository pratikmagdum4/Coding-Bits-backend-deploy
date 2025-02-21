//create admin model
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: [8, "Password should be at least 8 characters"],
  },
  secretKey: {
    type: String,
    required: [true, "Please add a secret key"],
    minlength: 4,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
},{timestamps: true});

export default mongoose.model("Admin", adminSchema);