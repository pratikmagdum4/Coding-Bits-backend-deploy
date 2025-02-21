import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../models/admin/adminModel.js";
import Student from "../../models/courseSection/student.js";
import Client from "../../models/freelancerPlatform/client.js";
import Teacher from "../../models/courseSection/teacher.js";
import Freelancer from "../../models/freelancerPlatform/freelancer.js";
import Recruiter from "../../models/jobPortal/recruiter.js";
import JobSeeker from "../../models/jobPortal/jobSeeker.js";

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

const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const Model = roleModels[role];
    console.log(email)
    console.log(password)
    console.log(role)
    if (!Model) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({ message: "Login successful", token, user,role });
  } catch (err) {
    res.status(500).json({ message: `Error logging in: ${err.message}` });
  }
};

export { Login };
