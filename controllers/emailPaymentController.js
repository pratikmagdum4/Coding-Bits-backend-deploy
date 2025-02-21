import {
  getSuccessEmailTemplate,
  getFailureEmailTemplate,
} from "../utils/template.js";
import { paymentEmailService } from "../services/paymentEmailService.js";
import dotenv from "dotenv";

dotenv.config();

export const sendPaymentEmail = async (req, res) => {
  const { transactionId, courseName, amount, errorMessage } = req.body;
  try {
    // Mock payment processing
    const paymentSuccessful = true; // Assume this comes from your payment gateway callback

    if (paymentSuccessful) {
      const emailTemplate = getSuccessEmailTemplate(
        transactionId,
        courseName,
        amount
      );
      await paymentEmailService(
        process.env.EMAIL_USER,
        "Payment Successful",
        emailTemplate
      );
      res.status(200).json({ message: "Payment successful email sent!" });
    } else {
      const emailTemplate = getFailureEmailTemplate(
        transactionId,
        courseName,
        amount,
        errorMessage
      );
      await paymentEmailService(
        process.env.EMAIL_USER,
        "Payment Failed",
        emailTemplate
      );
      res.status(400).json({ message: "Payment failed email sent!" });
    }
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
