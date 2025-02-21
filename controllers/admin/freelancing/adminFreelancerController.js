// import Freelancer from "../../models/freelancerPlatform/freelancer.js";
import project from "../../../models/freelancerPlatform/project.js";
const Project = project;
// Get all freelancers
export const getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find().populate("assignedProjects");
    res.status(200).json(freelancers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching freelancers", error: err });
  }
};

// Get freelancer profile with assigned projects
export const getFreelancerById = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id).populate("assignedProjects");
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });
    res.status(200).json(freelancer);
  } catch (err) {
    res.status(500).json({ message: "Error fetching freelancer", error: err });
  }
};

// Delete freelancer and unassign them from projects
export const deleteFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    if (!freelancer) return res.status(404).json({ message: "Freelancer not found" });

    await Project.updateMany({ assignedFreelancer: freelancer._id }, { assignedFreelancer: null }); // Unassign projects
    await Freelancer.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Freelancer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting freelancer", error: err });
  }
};
