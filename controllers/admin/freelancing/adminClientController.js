import Client from "../../../models/freelancerPlatform/client.js"  
import Project from "../../../models/freelancerPlatform/project.js";


// Get all clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate("postedProjects");
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clients", error: err });
  }
};

// Get client profile with projects
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate("postedProjects");
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (err) {
    res.status(500).json({ message: "Error fetching client", error: err });
  }
};

// Delete client and their projects
export const deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    await Project.deleteMany({ postedBy: client._id }); // Delete associated projects
    await Client.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Client and projects deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting client", error: err });
  }
};
