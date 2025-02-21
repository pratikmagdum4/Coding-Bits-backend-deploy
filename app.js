import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

import connectDB from './config/db.js';

// Route Imports
import protectedRoutes from './routes/protected.js';
import AuthRoutes from './routes/authRoutes/authRoutes.js';
import RecruiterRoutes from './routes/JobPortal/RecruiterRoutes.js';
import JobRoutes from './routes/JobPortal/JobRoutes.js';
import SeekerRoutes from './routes/JobPortal/SeekerRoutes.js';
import TeacherRoutes from './routes/CoursesRoutes/TeacherRoutes.js';
import CoursesRoutes from './routes/CoursesRoutes/CoursesRoutes.js';
import StudentRoutes from './routes/CoursesRoutes/StudentRoutes.js';
import freelancerRoutes from "./routes/freelancing/freelancerRoutes.js";
import clientRoutes from "./routes/freelancing/clientRoutes.js";
import projectRoutes from "./routes/freelancing/projectRoutes.js";
import lmsRoutes from './routes/lmsRoutes.js';

import auditLogRoutes from './routes/auditLogRoutes.js';
//import adminFreelancingRoutes from "./routes/adminRoutes/freelancing.js";

import adminFreelancingRoutes from "./routes/adminRoutes/freelancing/freelancing.js";
import adminRecruiterRoutes from "./routes/adminRoutes/jobportal/adminRecruiterRoutes.js";
import adminJobRoutes from "./routes/adminRoutes/jobportal/adminJobRoutes.js";
import adminJobSeekerRoutes from "./routes/adminRoutes/jobportal/adminJobSeekerRoutes.js";
import adminCourseSectionRoutes from './routes/adminRoutes/courseSection/adminCourseSectionRoutes.js'
import adminAllCount from './routes/adminRoutes/adminCountRoutes.js'
import adminTeacherRoutes from './routes/adminRoutes/courseSection/adminTeacherRoutes.js'
import adminStudentRoutes from './routes/CoursesRoutes/StudentRoutes.js'
dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware Configuration
app.use(bodyParser.json());
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://codingbits.vercel.app',
];



app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api', protectedRoutes);
app.use('/auth', AuthRoutes);
app.use('/job-portal', RecruiterRoutes);
app.use('/job-portal', JobRoutes);
app.use('/job-portal', SeekerRoutes);
app.use('/course-section', TeacherRoutes);
app.use('/course-section', CoursesRoutes);
app.use('/course-section', StudentRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/project", projectRoutes);
app.use('/api/lms', lmsRoutes);

app.use('/api/audit-logs', auditLogRoutes);

app.use("/api/admin", adminFreelancingRoutes);
app.use("/api/admin/recruiters", adminRecruiterRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/jobseekers", adminJobSeekerRoutes);
app.use("/api/admin/courses", adminCourseSectionRoutes);
app.use("/api/admin/teacher", adminTeacherRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api/admin", adminAllCount);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
