
import job from "../models/jobPortal/job.js";

const getJobs = async(req,res)=>{
    try{

        const {id} = req.params;
        const jobs = await job.find()

    }
}