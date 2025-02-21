import bcrypt from "bcryptjs";
import Admin from "../../models/admin/adminModel.js"; // Admin model
import Student from "../../models/courseSection/student.js"; // Student model
import Client from "../../models/freelancerPlatform/client.js"; // Client model
import Teacher from "../../models/courseSection/teacher.js"; // Teacher model
import Freelancer from "../../models/freelancerPlatform/freelancer.js"; // Freelancer model
import Recruiter from "../../models/jobPortal/recruiter.js"; // Recruiter model
import JobSeeker from "../../models/jobPortal/jobSeeker.js"; // JobSeeker model

const SignUp = async (req, res) => {
  try {
    const { role, email, name, password, passkey } = req.body;

    // Dynamically select the model based on the role
    let Model;
    switch (role) {
      case "admin":
        Model = Admin;
        if (passkey !== process.env.ADMIN_SECRET) {
          return res.status(400).json({ msg: "Invalid passkey for admin" });
        }
        break;
      case "student":
        Model = Student;
        break;
      case "client":
        Model = Client;
        break;
      case "freelancer":
        Model = Freelancer;
        break;
      case "teacher":
        Model = Teacher;
        break;
      case "recruiter":
        Model = Recruiter;
        break;
      case "job seeker":
        case "job_seeker": // Handle both formats
        case "jobSeeker":
          Model = JobSeeker;
          break;
      default:
        return res.status(400).json({ msg: "Invalid role" });
    }

    // Check if a user with the same email and role already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user based on the selected model
    const newUser = new Model({
      name,
      email,
      password: hashedPassword,
      ...(role === "admin" && { secretKey: passkey }), // Add role-specific fields if needed
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Error registering user: ${err.message}` });
  }
};

export { SignUp };