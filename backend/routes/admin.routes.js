import express from "express";
import { authenticate, hasRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
	"/dashboard",
	authenticate,
	hasRole("admin"), // Vérifie que l'utilisateur est admin
	(req, res) => {
		res.status(200).json({
			success: true,
			message: "Bienvenue sur le Dashboard Admin",
			data: {
			},
		});
	}
);

export default router;
