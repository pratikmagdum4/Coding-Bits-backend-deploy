import Freelancer from '../../models/freelancerPlatform/freelancer.js';
import Project from '../../models/freelancerPlatform/project.js';


export const createFreelancerProfile = async (req, res) => {
    try {
        const { name, email, skills, portfolio, hourlyRate, profilePicture, bio } = req.body;
        const newFreelancer = new Freelancer({
            name,
            email,
            skills,
            portfolio,
            hourlyRate,
            profilePicture,
            bio,
        });

        await newFreelancer.save();
        res.status(201).json({ message: 'Profile created successfully', freelancer: newFreelancer });
    } catch (error) {
        res.status(500).json({ message: 'Error creating freelancer profile', error: error.message });
    }
};

// Get freelancer profile
export const getFreelancerProfile = async (req, res) => {
    try {

        const freelancerId = req.user.id;
        console.log("the id is ", freelancerId)
        const freelancer = await Freelancer.findById(freelancerId)
            .populate('appliedProjects')
            .populate('assignedProjects');

        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.status(200).json({ freelancer });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching freelancer profile', error: error.message });
    }
};

// Update freelancer profile
export const updateFreelancerProfile = async (req, res) => {
    try {
        const freelancerId = req.params.id;
        const updateData = req.body;

        const freelancer = await Freelancer.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        // Update profile using the custom updateProfile method from the Freelancer model
        const updatedFreelancer = await freelancer.updateProfile(updateData);
        res.status(200).json({ message: 'Profile updated successfully', freelancer: updatedFreelancer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};
const AddUpdateFreelancerProfile = async (req, res) => {
    try {
        const { name, email, skills, location, resume, portfolio, hourlyRate, appliedProjects } = req.body;
        const id = req.user.id;

        const updatedSkills = Array.isArray(skills) ? skills : [];

        let freelancer = await Freelancer.findById(id);

        if (!freelancer) {
            freelancer = new Freelancer({
                _id: id,
                name,
                email,
                skills: updatedSkills,
                location,
                resume,
                portfolio,
                hourlyRate,
                appliedProjects,
            });
        } else {
            freelancer.name = name || freelancer.name;
            freelancer.email = email || freelancer.email;
            freelancer.skills = updatedSkills.length > 0 ? updatedSkills : freelancer.skills;
            freelancer.location = location || freelancer.location;
            freelancer.resume = resume || freelancer.resume;
            freelancer.portfolio = portfolio || freelancer.portfolio;
            freelancer.hourlyRate = hourlyRate || freelancer.hourlyRate;
            freelancer.appliedProjects = appliedProjects || freelancer.appliedProjects;
        }

        await freelancer.save();

        res.status(200).json({ msg: "Freelancer profile updated successfully", freelancer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Delete freelancer profile
export const deleteFreelancerProfile = async (req, res) => {
    try {
        const freelancerId = req.params.id;
        const freelancer = await Freelancer.findByIdAndDelete(freelancerId);

        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile', error: error.message });
    }
};

// Browse all open projects
export const browseProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('postedBy'); // Populate client information for each project
        console.log("proect are", projects)
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// View applied projects
export const getAppliedProjects = async (req, res) => {
    try {
        const freelancerId = req.user.id;
        const freelancer = await Freelancer.findById(freelancerId).populate('appliedProjects');

        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.status(200).json({ appliedProjects: freelancer.appliedProjects });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applied projects', error: error.message });
    }
};

// View assigned projects
export const getAssignedProjects = async (req, res) => {
    try {
        const freelancerId = req.params.id;
        const freelancer = await Freelancer.findById(freelancerId).populate('assignedProjects');

        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.status(200).json({ assignedProjects: freelancer.assignedProjects });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned projects', error: error.message });
    }
};

// Rate a project (after completion)
export const rateCompletedProject = async (req, res) => {
    try {
        const { projectId, rating } = req.body; // Rating should be between 1-10
        const freelancerId = req.params.id;

        const freelancer = await Freelancer.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        // Check if the project is completed
        const project = await Project.findById(projectId);
        if (!project || !project.isCompleted) {
            return res.status(400).json({ message: 'Project is not yet completed' });
        }

        // Update the freelancer's rating based on the rating
        freelancer.rating = (freelancer.rating * freelancer.completedProjects + rating) / (freelancer.completedProjects + 1);
        freelancer.completedProjects += 1;
        await freelancer.save();

        res.status(200).json({ message: 'Project rated successfully', freelancer });
    } catch (error) {
        res.status(500).json({ message: 'Error rating project', error: error.message });
    }
};


export const applyForJob = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { coverLetter, bidAmount } = req.body;
        const freelancerId = req.user.id;
        // Validate inputs
        if (!freelancerId || !coverLetter || !bidAmount) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found." });
        }

        // Check if freelancer exists
        const freelancer = await Freelancer.findById(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ message: "Freelancer not found." });
        }

        // Check if freelancer has already applied
        const alreadyApplied = project.proposals.some(
            (proposal) => proposal.freelancerId.toString() === freelancerId
        );
        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this job." });
        }

        // Add proposal to the project
        project.proposals.push({
            freelancerId: freelancerId,
            coverLetter,
            bidAmount,
            submittedOn: new Date(),
        });

        // Add project to freelancer's applied list
        freelancer.appliedProjects.push(projectId);

        // Save updates
        await project.save();
        await freelancer.save();

        return res.status(200).json({ message: "Proposal submitted successfully!" });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export { AddUpdateFreelancerProfile };