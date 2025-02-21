import mongoose from 'mongoose';
const clientSchema = new mongoose.Schema({
	
	name: { type: String, required: true },
	password: { type: String, },
	email: { type: String, required: true, unique: true },
	company: { type: String },
	domain: { type: String },
	contactNumber: { type: String }, 
	profilePicture: { type: String }, 
	postedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
	rating: { type: Number, min: 0, max: 5, default: 0 }, 
	totalProjectsPosted: { type: Number, default: 0 }, 
	dateJoined: { type: Date, default: Date.now },
  });
  
  export default mongoose.model("Client", clientSchema);
  
