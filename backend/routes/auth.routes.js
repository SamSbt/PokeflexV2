import express from "express";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import { login } from "../controllers/Auth.controller.js";

const router = express.Router();

// Route de connexion pour générer un token
router.post("/login", login);

// Exemple de route protégée nécessitant une authentification et un rôle spécifique
router.get("/protected", authenticate, hasRole("admin"), (req, res) => {
	res.status(200).json({ success: true, message: "Access granted" });
});

export default router;
