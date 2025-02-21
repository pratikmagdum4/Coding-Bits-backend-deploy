import express from "express";
import { SignUp } from "../../controllers/auth/SignupController.js";
import { Login } from "../../controllers/auth/LoginController.js";
import { forgotPassword, resetPassword } from "../../controllers/auth/ForgotPasswordController.js";
import { otpRequestLimiter, otpCooldown } from "../../services/rateLimiter.js";


const router = express.Router();

// Authentication Routes
router.post("/login", Login);
router.post("/signup", SignUp);

// Password Reset Routes
router.post("/forgot-password", otpRequestLimiter, otpCooldown, forgotPassword);
router.post("/reset-password", resetPassword);


export default router;
