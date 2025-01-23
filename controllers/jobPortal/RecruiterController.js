import Job from "../../models/jobPortal/job.js";
import Recruiter from "../../models/jobPortal/recruiter.js";
import applications from "../../models/jobPortal/applications.js";
import JobSeeker from "../../models/jobPortal/jobSeeker.js";
const AddJob = async (req,res) => {
    try {

        const { title, description, skillsRequired, location, salaryRange, applications, status, companyLogo, matchCriteria } = req.body;
        const postedBy = req.user.id;
        console.log("poseted id is ",postedBy)
        if (!title || !description || !skillsRequired || !location) {
            res.status(400).json({ msg: "Missing fields required" });
        }
        const newJob = new Job({
            title, description, skillsRequired, location, salaryRange, applications, status, companyLogo, matchCriteria,postedBy
        })
        const savedJob = await newJob.save();

      const re =  await Recruiter.findByIdAndUpdate(
            postedBy, {
            $push: { postedJobs: savedJob._id }
         },
         { new: true }   
        )
        console.log("the rescur is ",re)
        res.status(201).json({message:"Job posted Successfully ",job:savedJob});

    }catch (err) {
      console.log("The error is",err)
    res.status(500).json({message:"Internal server error",err})
}
}


const updateJob = async (req,res) =>{
    try{
        const {id} = req.params;
        const {title, description, skillsRequired, location, salaryRange, companyLogo, matchCriteria, status }  = req.body;
        const postedBy = req.user.id;

        const job = await Job.findById(id);
        if(!job)
        {
            return res.status(404).json({msg:"Job not found"});
        }

        if(job.postedBy.toString() !== postedBy)
        {
            return res.status(403).json({msg:"You are not authorized to update this job"});
        }
        job.title = title || job.title;
    job.description = description || job.description;
    job.skillsRequired = skillsRequired || job.skillsRequired;
    job.location = location || job.location;
    job.salaryRange = salaryRange || job.salaryRange;
    job.companyLogo = companyLogo || job.companyLogo;
    job.matchCriteria = matchCriteria || job.matchCriteria;
    job.status = status || job.status;

    const updatedJob = await job.save();

    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    }catch(err)
    {
        console.error('Error updating job:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const deleteJob = async (req, res) => {
    try {
      const { id } = req.params; 
      const postedBy = req.user.id;
  
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
   
      if (job.postedBy.toString() !== postedBy) {
        return res.status(403).json({ message: 'You are not authorized to delete this job' });
      }
  
      await Job.findByIdAndDelete(id);
  
     
      await Recruiter.findByIdAndUpdate(
        postedBy,
        { $pull: { postedJobs: id } },
        { new: true }
      );
  
      
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
      console.error('Error deleting job:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getJobsByRecruiter = async (req, res) => {
    try {
      const postedBy = req.user.id; 
      console.log("id in get is",postedBy)
      const jobs = await Job.find({ postedBy });
  
      if (jobs.length === 0) {
        return res.status(200).json({ message: 'No jobs posted yet', jobs: [] });
      }
  
      res.status(200).json({ jobs });
    } catch (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getApplicants = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { jobId } = req.params;

       
        const applications1 = await applications.find({ jobId }).populate('userId', 'name email profile');

        if (!applications1 || applications1.length === 0) {
            return res.status(404).json({ message: "No applicants found for this job." });
        }

        res.status(200).json({ success: true, data: applications1 });
    } catch (err) {
        console.error("Error fetching applicants:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


const getProfileDataOfApplicant = async (req,res)=>{
  try{
      const {seekerId} = req.params;
      // console.log()
      const user = await JobSeeker.findById({_id:seekerId});
      console.log("the user is",user)
      if(!user)
      {
          res.status(404).json({msg:"Seeker not found"})
      }
      res.status(200).json(user);
  }catch(err)
  {
    console.log("error is",NativeError)
      res.status(500).json({msg:"Internal server error"});
  }
}
const updateApplicationStatusChange = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    // Find the application by ID
    const application = await applications.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, msg: "Application not found" });
    }

    // Update the status
    application.status = status || application.status;
    await application.save();

    // Send success response
    res.status(200).json({ success: true, msg: "Status updated successfully" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, msg: "Status update failed" });
  }
};
  export {AddJob,updateJob,deleteJob,getJobsByRecruiter,getApplicants,getProfileDataOfApplicant,updateApplicationStatusChange};