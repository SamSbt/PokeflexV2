import express from "express";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import { login, register } from "../controllers/Auth.controller.js";

const router = express.Router();

// route de connexion
router.post("/login", login);

// route d'enregistrement
router.post("/register", register);

// route dashboard nécessitant authentification et rôle admin
router.get("/dashboard", authenticate, hasRole("Admin"), (req, res) => {
	res.status(200).json({
		success: true,
		message: "Bienvenue sur le Dashboard Admin",
		data: {},
	});
});

export default router;
