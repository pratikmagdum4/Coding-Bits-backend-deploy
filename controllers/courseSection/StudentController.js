import Student from "../../models/courseSection/student.js";
import userModel from "../../models/userModel.js";
import Teacher from "../../models/courseSection/teacher.js";

const AddUpdateStudentProfile = async (req, res) => {
    try {
      const { name, email, password, enrolledCourses, progress } = req.body;
      const id = req.user.id; 
  
      let student = await Student.findById(id);
      const user = await userModel.findById(id);
      if (!student) {
        
        const hashedPassword = await bcrypt.hash(password, 10); 
        student = new Student({
          _id: id,
          name,
          email,
          password: user.password,
          enrolledCourses: enrolledCourses || [],
          progress: progress || [],
        });
      } else {
        student.name = name || student.name;
        student.email = email || student.email;
  
       
        // if (password) {
        //   const hashedPassword = await bcrypt.hash(password, 10);
        //   student.password = hashedPassword;
        // }
  
        if (enrolledCourses) {
          student.enrolledCourses = enrolledCourses;
        }
        if (progress) {
          student.progress = progress;
        }
      }
  
      await student.save();
  
      res.status(200).json({
        msg: "Student profile updated successfully",
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          enrolledCourses: student.enrolledCourses,
          progress: student.progress,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server error" });
    }
  };
const getStudentProfile = async(req,res)=>{
    try{
        const id = req.user.id;

        const profile = await Student.findById(id);
        if(!profile)
        {
            return res.status(404).json({msg:"Student Not found"})
        }
        res.status(200).json(profile);
    }catch(error)
    {
        console.error(err);
      res.status(500).json({ msg: "Internal Server error" });
    }
}
export {AddUpdateStudentProfile,getStudentProfile}