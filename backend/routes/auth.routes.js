import express from "express";
import rateLimit from "express-rate-limit";
import {
	login,
	register,
	refreshAccessToken,
	logout,
} from "../controllers/Auth.controller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import { jwtCookieConfig } from "../utils/jwtUtils.js";

const router = express.Router();

const loginLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5min
	max: 5, // 5 tentatives max par IP
	message: {
		success: false,
		message:
			"Trop de tentatives de connexion. Veuillez réessayer après 5 minutes.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshAccessToken);

router.post("/logout", (req, res) => {
	// Clear the refresh token cookie
	res.clearCookie("jwt", {
		...jwtCookieConfig,
		maxAge: 0,
	});
	res.json({ success: true, message: "Logged out successfully" });
});

// route dashboard nécessitant authentification et rôle admin
router.get("/dashboard", authenticate, hasRole("Admin"), (req, res) => {
	res.status(200).json({
		success: true,
		message: "Bienvenue sur le Dashboard Admin",
		data: {},
	});
});

export default router;
