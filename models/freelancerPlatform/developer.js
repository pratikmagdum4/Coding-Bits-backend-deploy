const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
	developerId: { type: mongoose.Schema.Types.ObjectId, auto: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	skills: [{ type: String }],
	portfolio: { type: String },
	appliedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
	assignedProjects: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Project" },
	],
	hourlyRate:{type:Number},
	profilePicture:{type:String},
	rating:{type:Number,min:0,max:10,default:0},
	completedProjects:{type:Number,default:0},
	bio:{type:String},
	availability:{type:Boolean,default:true},
	dateJoined:{type:Date,default:Date.now},
});

module.exports = mongoose.model("Developer", developerSchema);
