import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	skillsRequired: [{ type: String }],
	budget: { type: String },
	postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
	status: {
		type: String,
		enum: ["Open", "In Progress", "Completed"],
		default: "Open",
	},
	assignedFreelancer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Developer",
	},
	paymentStatus: {
		type: String,
		enum: ["Pending", "Completed"],
		default: "Pending",
	},
	deadline:{type:Date},
	milestones: [ 
		{
		  title: { type: String },
		  description: { type: String },
		  dueDate: { type: Date },
		  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
		},
	  ],
	  tags:[{type:String}],
	  proposals: [ 
		{
			freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "freelancer" },
		  coverLetter: { type: String },
		  bidAmount: { type: Number },
		  submittedOn: { type: Date, default: Date.now },
		},
	  ],
	  creationDate: { type: Date, default: Date.now }, 
	  lastUpdated: { type: Date, default: Date.now }
});

// module.exports = mongoose.model("Project", projectSchema);
export default mongoose.model("Project", projectSchema);
