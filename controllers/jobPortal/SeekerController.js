import JobSeeker from "../../models/jobPortal/jobSeeker.js";
import Job from "../../models/jobPortal/job.js";

const getProfileData = async (req,res)=>{
    try{
        const id = req.user.id;
        // console.log()
        const user = await JobSeeker.findById(id);
        console.log("the user is",user)
        if(user==null)
        {
            res.status(400).json({msg:"Fill the Profile data"})
        }
        res.status(200).json(user);
    }catch(err)
    {
        res.status(500).json({msg:"Internal server error"});
    }
}
const getRecommendedJobs = async (req, res) => {
  try {
    const  id  = req.user.userId;
    console.log("id is in get ",id)
    const profile = await JobSeeker.findById(id);
    console.log("profile is",profile)
    if (!profile) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    const skills = profile.skills; 
    const allJobs = await Job.find();

    const recommendedJobs = allJobs.filter((job) => {
      
      return job.skillsRequired.some((skill) => skills.includes(skill));
    });

    res.status(200).json({ recommendedJobs });
  } catch (err) {
    console.error('Error fetching recommended jobs:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const AddUpdateProfileData = async (req, res) => {
  try {
      const { name, email, skills, location, resume, appliedJobs } = req.body;
      const id = req.user.id;

      const updatedSkills = Array.isArray(skills) ? skills : [];

      let user = await JobSeeker.findById(id);

      if (!user) {
          user = new JobSeeker({
              _id: id,
              name,
              email,
              skills: updatedSkills, 
              location,
              resume,
              appliedJobs,
          });
      } else {
          user.name = name || user.name;
          user.email = email || user.email;
          user.skills = updatedSkills.length > 0 ? updatedSkills : user.skills;
          user.location = location || user.location;
          user.resume = resume || user.resume;
          user.appliedJobs = appliedJobs || user.appliedJobs;
      }

      await user.save();

      res.status(200).json({ msg: "User profile updated successfully", user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Internal Server error' });
  }
};
export  {getRecommendedJobs,getProfileData,AddUpdateProfileData};