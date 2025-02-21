import jwt from 'jsonwebtoken';
import Admin from "../models/admin/adminModel.js";
import Student from "../models/courseSection/student.js";
import Client from "../models/freelancerPlatform/client.js";
import Teacher from "../models/courseSection/teacher.js";
import Freelancer from "../models/freelancerPlatform/freelancer.js";
import Recruiter from "../models/jobPortal/recruiter.js";
import JobSeeker from "../models/jobPortal/jobSeeker.js";

const roleModels = {
  admin: Admin,
  student: Student,
  client: Client,
  freelancer: Freelancer,
  teacher: Teacher,
  recruiter: Recruiter,
  "job seeker": JobSeeker,
  job_seeker: JobSeeker,
  jobSeeker: JobSeeker,
};

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("toje is",authHeader)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or malformed.' });
  }
  

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const Model = roleModels[decoded.role];

    if (!Model) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    req.user = await Model.findById(decoded.userId).select('-password');
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authenticate;
