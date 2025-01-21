import express from "express";
import { SignUp } from "../../controllers/user/SignupController.js";
import { Login } from "../../controllers/user/LoginController.js";
const router = express.Router();

router.post('/login',Login)
router.post('/signup',SignUp);

export default router;
