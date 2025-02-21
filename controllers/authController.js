import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/userModel.js";
import { logAudit } from "../services/auditLogService.js";
import { incrementLoginAttempts, resetLoginAttempts } from "../services/loginAttemptService.js";
import { generateToken } from "../utils/jwtUtils.js";

// Constants (from environment variables)
const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5;
const LOCK_TIME = process.env.LOCK_TIME || 2 * 60 * 60 * 1000; // 2 hours

// Utility function for error responses
const handleErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

// Role restriction helper
const isRoleRestricted = (role) => {
  const restrictedRoles = ["admin", "superadmin"];
  return restrictedRoles.includes(role.toLowerCase());
};

// Validation rules for registration
export const register = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain a special character"),
  body("role")
    .optional()
    .isIn(["user", "admin", "superadmin"])
    .withMessage("Invalid role provided"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = "user" } = req.body;

    if (isRoleRestricted(role)) {
      logAudit(`Restricted role registration attempt: Role "${role}" | Email: "${email}"`);
      return handleErrorResponse(res, 403, "Registration for Admin and Superadmin is restricted");
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return handleErrorResponse(res, 400, "Email already registered");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ name, email, password: hashedPassword, role });
      const savedUser = await user.save();

      res.status(201).json({
        message: "User registered successfully",
        user: savedUser,
      });
    } catch (err) {
      console.error(err);
      return handleErrorResponse(res, 500, "Server error, please try again");
    }
  },
];

// Login controller with validation
export const login = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return handleErrorResponse(res, 400, "Email not found");
      }

      // Check if the account is locked
      if (user.isLocked && user.lockUntil > Date.now()) {
        return handleErrorResponse(
          res,
          403,
          "Account is temporarily locked. Try again later."
        );
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        await incrementLoginAttempts(user, MAX_LOGIN_ATTEMPTS, LOCK_TIME); // Increment login attempts for invalid password
        return handleErrorResponse(res, 400, "Invalid password");
      }

      // Reset login attempts on success
      await resetLoginAttempts(user);

      const token = generateToken(user);

      logAudit(
        `Login successful: Email "${email}" | Role: "${user.role}" | IP: ${req.ip}`
      );

      res.header("Authorization", token).json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      return handleErrorResponse(res, 500, "Server error, please try again");
    }
  },
];
