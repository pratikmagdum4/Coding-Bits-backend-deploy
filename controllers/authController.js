const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const fs = require("fs")
const path=require("path")

const auditLogPath = path.join(__dirname, "../logs/audit.log");
const logAudit = (logEntry) => {
  const logMessage = `${new Date().toISOString()} | ${logEntry}\n`;
  fs.appendFileSync(auditLogPath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to audit log:", err);
    }
  });
};

const isRoleRestricted = (role) => {
  const restrictedRoles = ["admin", "superadmin"];
  return restrictedRoles.includes(role.toLowerCase());
};

module.exports.register = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain a letter"),
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
      return res.status(403).json({
        error: "Registration for Admin and Superadmin is restricted",
      });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          error: "Email already registered",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ name, email, password: hashedPassword, role });
      const savedUser = await user.save();

      return res.status(201).json({
        message: "User registered successfully",
        user: savedUser,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error, please try again" });
    }
  },
];

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "1h" }
    );
    logAudit(
      `Login successful: Email "${email}" | Role: "${user.role}" | IP: ${clientIp}`
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
    res.status(500).json({ error: "Server error, please try again" });
  }
};
