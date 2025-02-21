import bcrypt from "bcryptjs";
import User from "../../models/userModel.js";
import PasswordReset from "../../models/passwordResetSchema.js";
import { sendOtpEmail, generateOTP } from "../../services/emailService.js";

// Forgot Password Handler
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate OTP and expiration
    const otp = generateOTP();
    const expiration = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    // Save OTP and expiration in the database
    const existingReset = await PasswordReset.findOne({ email });
    if (existingReset) {
      existingReset.otp = otp;
      existingReset.expiration = expiration;
      await existingReset.save();
    } else {
      const resetRecord = new PasswordReset({ email, otp, expiration });
      await resetRecord.save();
    }

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password Handler
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (
    !newPassword ||
    newPassword.length < 8 ||
    !/\d/.test(newPassword) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters, and include at least one number and one special character.",
    });
  }

  try {
    const resetRecord = await PasswordReset.findOne({ email });
    if (!resetRecord || resetRecord.otp !== otp || resetRecord.expiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP record after successful password reset
    await PasswordReset.deleteOne({ email });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Server error" });
  }
};
