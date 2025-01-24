import Course from "../../models/courseSection/course.js";


const getAllCourses = async (req,res)=>{
    try{
        const courses = await Course.find();
        console.log("The courses are",courses)
        if(!courses)
        {
            return res.status(404).json({msg:"No Courses found"})
        }
        res.status(200).json(courses)
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({msg:"Internal server error"})
    }
}


export {getAllCourses};