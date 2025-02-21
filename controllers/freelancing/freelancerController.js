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
        const freelancerId = req.params.id;
        const freelancer = await Freelancer.findById(freelancerId)
            .populate('appliedProjects')
            .populate('assignedProjects'); // Populating applied and assigned projects for the freelancer

        if (!freelancer) {
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        res.status(200).json({ freelancer });
    } catch (error) {
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
        const projects = await Project.find({ isOpen: true }).populate('clientId'); // Populate client information for each project
        res.status(200).json({ projects });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

// View applied projects
export const getAppliedProjects = async (req, res) => {
    try {
        const freelancerId = req.params.id;
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
