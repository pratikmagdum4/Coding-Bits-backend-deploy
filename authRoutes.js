const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const router = express.Router();
const nodemailer=require('nodemailer');

// Sign Up
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        username,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (err) {
        console.error('Error comparing password', err);
        return res.status(500).json({ message: "Internal server error" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Login successful", token });

    //Create a transporter for email sending
    const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    },
});

// Request Password Reset
router.post('/password-reset-request', async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ username: email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate password reset token (valid for 1 hour)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // Send email with the reset token
  const resetLink = `http://localhost:5000/api/auth/password-reset/${token}`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `To reset your password, click the following link: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});
// Reset Password
router.post('/password-reset/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      // Verify the reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password successfully reset' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
    }
  });
});

module.exports = router;