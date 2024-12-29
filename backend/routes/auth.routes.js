import express from "express";
import {
	login,
	register,
	refreshAccessToken,
	logout,
} from "../controllers/Auth.controller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
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
