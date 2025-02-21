import client from "../../models/freelancerPlatform/client.js";
import Client from "../../models/freelancerPlatform/client.js";
import project from "../../models/freelancerPlatform/project.js";
const addUpdateClientProfile = async (req, res) => {
    try {

        
        const { name, email, company, domain, contactNumber, profilePicture } = req.body;
        const id = req.user.id;

        let client = await Client.findById(id);

        if (!client) {
           
            client = new Client({
                _id: id,
                name,
                email,
                company,
                domain,
                contactNumber,
                
            });
        } else {
           
            client.name = name || client.name;
            client.email = email || client.email;
            client.company = company || client.company;
            client.domain = domain || client.domain;
            client.contactNumber = contactNumber || client.contactNumber;
        }

        await client.save();
        res.status(200).json({ msg: "Client profile updated successfully", client });
    } catch (err) {
        console.error("Client profile update error:", err);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
};


const addProject = async (req, res) => {
    try {
        const {
            title,
            description,
            skillsRequired,
            budget,
            deadline,
            milestones,
            tags,
            proposals
        } = req.body;
        const id = req.user.id;
        if (!title || !description || !skillsRequired || !budget || !deadline) {
            return res.status(400).json({ msg: "All fields required" });
        }

        const postedBy = req.user.id;

        const newProject = new project({
            title,
            description,
            skillsRequired,
            budget,
            deadline,
            postedBy,
            milestones: milestones || [],
            tags: tags || [],
            proposals: proposals || [],
            status: "Open",
            paymentStatus: "Pending",
            assignedFreelancer: null,
            creationDate: new Date(),
            lastUpdated: new Date()
        });

        await newProject.save();
        const client = await Client.findById(id);
        client.postedProjects.push(newProject._id);
        await client.save();
        res.status(201).json({ msg: "Project created successfully", project: newProject });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};




 const getProjectsByClient = async (req, res) => {
    try {
        const clientId = req.user.id;
        
        const projects = await project.find({ postedBy: clientId }).populate("postedBy", "name email");

        if (!projects.length) {
            return res.status(404).json({ msg: "No projects found for this client" });
        }

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};
export {addProject,addUpdateClientProfile,getProjectsByClient}