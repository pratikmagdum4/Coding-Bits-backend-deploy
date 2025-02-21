
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  orderId: { type: String, required: true }, // Adding the orderId field to store Razorpay's orderId
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
  transactionId: { type: String },
  invoiceUrl: { type: String },
});

export default mongoose.model("Payment", paymentSchema);
