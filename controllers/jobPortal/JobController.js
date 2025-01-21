import Job from "../../models/jobPortal/job.js";

const getJobById = async (req,res)=>{
    try{
      const {id} = req.params;
      console.log("id is",id)
      const job = await Job.findOne({_id:id});
      if(!job)
      {
        res.status(404).json({msg:"Job not found"})
      }

      res.status(200).json(job);

    }catch(err)
    {
      res.status(500).json({msg:"Internal Server Error"})
    }
  }

  export {getJobById}