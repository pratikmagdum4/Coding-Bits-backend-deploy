import Teacher from "../../models/courseSection/teacher.js";
import Student from "../../models/courseSection/student.js";
import Recruiter from "../../models/jobPortal/recruiter.js";
import JobSeeker from "../../models/jobPortal/jobSeeker.js";
import client from "../../models/freelancerPlatform/client.js";
import freelancer from "../../models/freelancerPlatform/freelancer.js";


const getAllCounts = async (req,res)=>{
    try{

            const TeacherCount = await Teacher.countDocuments();
            const StudentCount = await Student.countDocuments();
            const ClientCount = await client.countDocuments();
            const jobSeekerCount = await JobSeeker.countDocuments();
            const RecruiterCount = await Recruiter.countDocuments();
            const freelancerCount = await freelancer.countDocuments();
            const data = {TeacherCount,StudentCount,ClientCount,jobSeekerCount,RecruiterCount,freelancerCount}
            res.status(200).json(data)
            
    }catch(error)
    {
        console.log(error);
        res.status(500).json({msg:"Internal server error"});
    }
}

export  {getAllCounts};