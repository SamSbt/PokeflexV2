import express from "express";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import {
	login,
	register,
	refreshAccessToken, logout
} from "../controllers/Auth.controller.js";

const router = express.Router();

// route d'enregistrement
router.post("/register", register);

// route de connexion
router.post("/login", login);

// Route de rafraîchissement du token
router.post("/refresh", refreshAccessToken);

// Route de déconnexion
router.post("/logout", logout);

// route dashboard nécessitant authentification et rôle admin
router.get("/dashboard", authenticate, hasRole("Admin"), (req, res) => {
	res.status(200).json({
		success: true,
		message: "Bienvenue sur le Dashboard Admin",
		data: {},
	});
});

export default router;
