import rateLimit from "express-rate-limit";
import PasswordReset from "../models/passwordResetSchema.js"; // Ensure this path is correct

// Custom key generator for OTP requests (combines IP and user email/phone)
const generateOTPKey = (req) => {
  const ip = req.ip;
  const identifier = req.body.email || req.body.phone || "unknown";
  return `${ip}_${identifier}`;
};

// Rate limiter for OTP requests
export const otpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit to 5 OTP requests per IP+identifier combination per hour
  keyGenerator: generateOTPKey, // Custom key generator for combined IP and identifier
  handler: (req, res) => {
    res.status(429).json({
      message:
        "Too many OTP requests. Please wait and try again after some time.",
    });
  },
  skipFailedRequests: true, // Skips counting failed requests (e.g., invalid input)
});

// Middleware for cooldown periods between consecutive OTP requests
export const otpCooldown = async (req, res, next) => {
  const identifier = req.body.email || req.body.phone;

  if (!identifier) {
    return res.status(400).json({ message: "Email or phone is required." });
  }

  try {
    // Check for recent OTP requests in the PasswordReset schema
    const recentRequest = await PasswordReset.findOne({ identifier })
      .sort({ createdAt: -1 }) // Get the latest request
      .exec();

    if (recentRequest) {
      const cooldownPeriod = 2 * 60 * 1000; // 2-minute cooldown period
      const timeSinceLastRequest = Date.now() - new Date(recentRequest.createdAt);

      if (timeSinceLastRequest < cooldownPeriod) {
        const waitTime = Math.ceil((cooldownPeriod - timeSinceLastRequest) / 1000);
        return res.status(429).json({
          message: `You must wait ${waitTime} seconds before requesting another OTP.`,
        });
      }
    }

    next();
  } catch (error) {
    console.error("Error in OTP cooldown middleware:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
