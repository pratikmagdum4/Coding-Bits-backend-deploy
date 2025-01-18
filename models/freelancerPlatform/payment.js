const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
	paymentId: { type: mongoose.Schema.Types.ObjectId, auto: true },
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project",
		required: true,
	},
	developerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Developer",
		required: true,
	},
	amount: { type: Number, required: true },
	paymentDate: { type: Date, default: Date.now },
	paymentMethod: { type: String },
	status: {
		type: String,
		enum: ["Pending", "Completed"],
		default: "Pending",
	},
	transactionId:{type:String},
	invoiceUrl:{type:String},
});


module.exports = mongoose.model("Payment", paymentSchema);
