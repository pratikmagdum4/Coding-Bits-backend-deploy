import Course from "../models/courseSection/course.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const LMS_TOKEN_EXPIRY = "1h"; // Adjust as needed

export const generateLmsToken = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Extracted from authenticated request

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found." });

    if (!course.students.includes(userId))
      return res.status(403).json({ error: "Access denied. Not enrolled." });

    const token = jwt.sign({ courseId, userId }, JWT_SECRET, { expiresIn: LMS_TOKEN_EXPIRY });

    await course.generateLmsAccessToken(userId, token, new Date(Date.now() + 3600000));

    res.json({ token, expiresAt: new Date(Date.now() + 3600000) });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Verify LMS token
export const verifyLmsToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const { courseId, userId } = decoded;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Invalid course." });

    if (!course.verifyLmsAccessToken(userId, token))
      return res.status(403).json({ error: "Invalid or expired token." });

    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized", details: error.message });
  }
};

// Fetch LMS links (live or recorded)
export const getLmsLinks = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found." });

    if (!course.students.includes(userId))
      return res.status(403).json({ error: "Unauthorized access." });

    const links = course.type === "Live"
      ? { liveLink: course.liveDetails.meetingLink }
      : { recordings: course.recordings };

    res.json(links);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
