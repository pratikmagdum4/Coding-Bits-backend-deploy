import JobSeeker from "../../models/jobPortal/jobSeeker.js";
import Job from "../../models/jobPortal/job.js";
import mongoose from "mongoose";
// import jobApplication from "../../models/jobPortal/jobApplication.js";
import applications from "../../models/jobPortal/applications.js";
const getProfileData = async (req, res) => {
    try {
        const id = req.user.id;
        // console.log()
        const user = await JobSeeker.findById(id);
        console.log("the user is", user)
        if (user == null) {
            return res.status(400).json({ msg: "Fill the Profile data" })
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error" });
    }
}
const getRecommendedJobs = async (req, res) => {
    try {
        const id = req.user.id;
        console.log("id is in get ", id)
        const profile = await JobSeeker.findById(id);
        console.log("profile is", profile)
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

const applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;
        const { resume, coverLetter } = req.body;

        // Validate job ID
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ msg: "Invalid job ID" });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Check if the job is active
        if (job.status !== 'active') {
            return res.status(400).json({ msg: "This job is no longer active" });
        }

        // Check if the user exists
        const user = await JobSeeker.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if the user has already applied to this job
        const existingApplication = await applications.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({ msg: "You have already applied to this job" });
        }

        // Create a new application
        const newApplication = new applications({
            jobId,
            userId,
            resume,
            coverLetter,
            status: "applied",
            history: [{ status: 'applied', updatedAt: Date.now() }],
        });

        // Save the new application
        await newApplication.save();

        // Update the job's applications array
        job.applications.push(newApplication._id);
        await job.save();

        // Update the user's appliedJobs array
        user.appliedJobs.push(jobId);
        await user.save();

        // Return success response
        res.status(201).json({
            message: "Application submitted successfully",
            application: newApplication,
        });
    } catch (err) {
        console.error('Error applying to job:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}; const getAppliedJobs = async (req, res) => {
    try {
        const id = req.user.id;

        // Find all applications for the user and populate the job details
        const applications1 = await applications
            .find({ userId: id })
            .populate({
                path: 'jobId',
                select: 'title description location salaryRange status companyLogo',
            });
        console.log("jobs are", applications1)
        // If no applications are found, return a 404 response
        if (!applications1 || applications1.length === 0) {
            return res.status(404).json({ message: 'No applied jobs found' });
        }

        // Return the list of applied jobs with job details
        res.status(200).json({
            message: 'Applied jobs fetched successfully',
            applications1,
        });
    } catch (err) {
        console.error('Error fetching applied jobs:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export { getRecommendedJobs, getProfileData, AddUpdateProfileData, applyToJob, getAppliedJobs };