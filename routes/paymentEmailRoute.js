import express from "express";
import { sendPaymentEmail } from "../controllers/emailPaymentController.js";

const router = express.Router();

router.post("/sendPaymentEmail", sendPaymentEmail);

export default router;
