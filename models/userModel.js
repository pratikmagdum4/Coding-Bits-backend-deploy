import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // username: { type: String, unique: true }, // Optional username for compatibility
  name: { type: String, required: true }, // Added 'name' for compatibility
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp:{type:Number},

  role: { type: String, required: true, default: "user" }, 
  profilePicture: { type: String }, // URL to profile picture
  bio: { type: String }, // Short bio for job seekers
  isEmailValidated: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockUntil: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Method to increment login attempts and handle locking
UserSchema.methods.incrementLoginAttempts = async function (maxAttempts, lockTime) {
  if (this.isLocked && this.lockUntil && this.lockUntil > Date.now()) {
    return this.save();
  }

  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.isLocked = false;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;

    if (this.loginAttempts >= maxAttempts) {
      this.isLocked = true;
      this.lockUntil = Date.now() + lockTime;
    }
  }
  return this.save();
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.isLocked = false;
  this.lockUntil = undefined;
  return this.save();
};

export default mongoose.model("User", UserSchema);
