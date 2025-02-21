import User from "../models/userModel.js";

// Maximum login attempts and lock time
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // Lock time in milliseconds (30 minutes)

export const incrementLoginAttempts = async (user, maxAttempts, lockTime) => {
  if (user.loginAttempts >= maxAttempts) {
    user.isLocked = true;
    user.lockUntil = Date.now() + lockTime;
    await user.save();
  } else {
    user.loginAttempts += 1;
    await user.save();
  }
};

export const resetLoginAttempts = async (user) => {
  user.loginAttempts = 0;
  user.isLocked = false;
  user.lockUntil = null;
  await user.save();
};
