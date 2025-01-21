import Job from "../../models/jobPortal/job.js";
import Recruiter from "../../models/jobPortal/recruiter.js";

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

    // Return the updated job
    res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    }catch(err)
    {
        console.error('Error updating job:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const deleteJob = async (req, res) => {
    try {
      const { id } = req.params; // Job ID
      const postedBy = req.user.id; // Recruiter's ID from authentication middleware
  
      // Find the job by ID
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      // Check if the logged-in recruiter is the one who posted the job
      if (job.postedBy.toString() !== postedBy) {
        return res.status(403).json({ message: 'You are not authorized to delete this job' });
      }
  
      // Delete the job
      await Job.findByIdAndDelete(id);
  
      // Remove the job ID from the recruiter's postedJobs array
      await Recruiter.findByIdAndUpdate(
        postedBy,
        { $pull: { postedJobs: id } },
        { new: true }
      );
  
      // Return success message
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



  
  export {AddJob,updateJob,deleteJob,getJobsByRecruiter};