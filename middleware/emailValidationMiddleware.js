import { validateEmailToken } from "../services/emailService";

export const emailValidationMiddleware = async (req, res, next) => {
	const { token } = req.params;

	if (!token) {
		return res.status(400).json({ error: "Token is required" });
	  }
	
	try {
		const result = await validateEmailToken(token);
		req.user = result.user; // Attach validated user to request object
		next();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
