import Client from "../../models/freelancerPlatform/client.js";
import project from "../../models/freelancerPlatform/project.js";


// Add or Update Project
const addUpdateProject = async (req, res) => {
    try {
        const { title, description, skillsRequired, budget, deadline, status, tags } = req.body;
        const postedBy = req.user.id; // Client ID

        // Ensure skillsRequired and tags are arrays
        const updatedSkills = Array.isArray(skillsRequired) ? skillsRequired : [];
        const updatedTags = Array.isArray(tags) ? tags : [];

        let project = await Project.findOne({ title, postedBy });

        if (!project) {
            // Create new project
            project = new Project({
                title,
                description,
                skillsRequired: updatedSkills,
                budget,
                deadline,
                status,
                tags: updatedTags,
                postedBy,
            });
        } else {
            // Update existing project
            project.description = description || project.description;
            project.skillsRequired = updatedSkills.length > 0 ? updatedSkills : project.skillsRequired;
            project.budget = budget || project.budget;
            project.deadline = deadline || project.deadline;
            project.status = status || project.status;
            project.tags = updatedTags.length > 0 ? updatedTags : project.tags;
        }

        await project.save();
        res.status(200).json({ msg: "Project updated successfully", project });
    } catch (err) {
        console.error("Project update error:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
};


// Get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await project.find().populate("postedBy", "name email");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};

// Get a specific project by ID
 const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project1 = await project.findById(projectId).populate("postedBy", "name email");
        if (!project1) return res.status(404).json({ msg: "Project not found" });

        res.status(200).json(project1);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};

// Update a project
const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const projectToUpdate = await project.findById(projectId);

        if (!projectToUpdate) return res.status(404).json({ msg: "Project not found" });

        const { title, description, skillsRequired, budget, status, deadline, paymentStatus } = req.body;

        if (title) projectToUpdate.title = title;
        if (description) projectToUpdate.description = description;
        if (skillsRequired) projectToUpdate.skillsRequired = skillsRequired;
        if (budget) projectToUpdate.budget = budget;
        if (status) projectToUpdate.status = status;
        if (deadline) projectToUpdate.deadline = deadline;
        if (paymentStatus) projectToUpdate.paymentStatus = paymentStatus;

        projectToUpdate.lastUpdated = new Date();
        await projectToUpdate.save();

        res.status(200).json({ msg: "Project updated successfully", project: projectToUpdate });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const id = req.user.id;
        // Step 1: Find and delete the project
        const deletedProject = await project.findByIdAndDelete(projectId);
        if (!deletedProject) return res.status(404).json({ msg: "Project not found" });

        // Step 2: Find the client who posted the project
        const client = await Client.findById(id);
        if (!client) return res.status(404).json({ msg: "Client not found for this project" });

        // Step 3: Remove the project ID from the client's postedProjects array
        client.postedProjects = client.postedProjects.filter(id => id.toString() !== projectId);

        // Step 4: Decrement the totalProjectsPosted count
        client.totalProjectsPosted -= 1;

        // Step 5: Save the updated client
        await client.save();

        res.status(200).json({ msg: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};
export {getAllProjects,deleteProject,updateProject,addUpdateProject,getProjectById}