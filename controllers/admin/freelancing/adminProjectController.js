import project from "../../../models/freelancerPlatform/project.js";
// import Freelancer from "../../models/freelancerPlatform/freelancer.js";
const Project = project;
// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("assignedDeveloper").populate("postedBy");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Error fetching project", error: err });
  }
};

// Update project details
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: "Error updating project", error: err });
  }
};

// Remove freelancer from project
export const removeFreelancerFromProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.assignedFreelancer = null;
    await project.save();
    res.status(200).json({ message: "Freelancer removed from project" });
  } catch (err) {
    res.status(500).json({ message: "Error removing freelancer", error: err });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project", error: err });
  }
};
