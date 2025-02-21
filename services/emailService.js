import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

// Configure the transporter using environment variables
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL, // Email address from environment
    pass: process.env.EMAIL_PASSWORD, // Email password from environment
  },
});

// Helper function to generate OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
};

// Helper function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Use the OTP below to proceed:</p>
        <h3>${otp}</h3>
        <p>This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}:`, info.response);
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email. Please try again later.');
  }
};

// Helper function to validate email sending configuration
export const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      'Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS in the .env file.'
    );
  }
};
