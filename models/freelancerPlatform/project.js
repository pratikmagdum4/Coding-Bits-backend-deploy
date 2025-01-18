const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
	projectId: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
	assignedDeveloper: {
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
		  developerId: { type: mongoose.Schema.Types.ObjectId, ref: "Developer" },
		  coverLetter: { type: String },
		  bidAmount: { type: Number },
		  submittedOn: { type: Date, default: Date.now },
		},
	  ],
	  creationDate: { type: Date, default: Date.now }, 
	  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);
