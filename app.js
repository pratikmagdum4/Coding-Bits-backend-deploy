import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protected.js';
import cors from 'cors';

import User from './models/userModel.js'; 
import PasswordReset from './models/passwordResetSchema.js'; 
import { sendResetEmail } from './services/emailService.js'; 
import RecruiterRoutes from './routes/JobPortal/RecruiterRoutes.js'
import JobRoutes from './routes/JobPortal/JobRoutes.js'
import SeekerRoutes from './routes/JobPortal/SeekerRoutes.js'
import AuthRoutes from './routes/authRoutes/authRoutes.js'
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: 'Too many requests, please try again later.',
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 reset password requests per 15 minutes
  message: 'Too many reset attempts, please try again later.',
});

// Route to request password reset
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });

  const resetToken = new PasswordReset({
    email,
    token,
    expiration: new Date(Date.now() + 60 * 60 * 1000), 
  });

  await resetToken.save();
  sendResetEmail(email, token);

  res.status(200).json({ message: 'Password reset email sent' });
});

// Route to reset the password
app.post('/reset-password', resetPasswordLimiter, async (req, res) => {
  const { token, newPassword } = req.body;

  if (
    !newPassword ||
    newPassword.length < 8 ||
    !/\d/.test(newPassword) ||
    !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  ) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters, and include at least one number and one special character.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const email = decoded.email;

    const resetToken = await PasswordReset.findOne({ token });
    if (!resetToken || resetToken.expiration < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await PasswordReset.deleteOne({ token });

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(400).json({ message: 'Invalid token' });
  }
});

app.use(express.json());

connectDB();
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/job-portal',RecruiterRoutes)
app.use('/job-portal',JobRoutes)
app.use('/auth',AuthRoutes)
app.use('/job-portal',SeekerRoutes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
