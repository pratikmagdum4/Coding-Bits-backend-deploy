const clientSchema = new mongoose.Schema({
	clientId: { type: mongoose.Schema.Types.ObjectId, auto: true },
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	company: { type: String },
	contactNumber: { type: String }, 
	profilePicture: { type: String }, 
	postedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
	rating: { type: Number, min: 0, max: 5, default: 0 }, 
	totalProjectsPosted: { type: Number, default: 0 }, 
	dateJoined: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("Client", clientSchema);
  