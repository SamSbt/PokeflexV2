import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppUser from "../models/AppUser.model.js";
import Role from "../models/Role.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import { createAccessToken, createRefreshToken } from "../utils/jwtUtils.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

	console.log("req.body ds auth controller :", req.body);
	if (!username || !email || !password) {
		return res.status(400).json({
			success: false,
			message: "Email et mot de passe sont requis.",
		});
	}

	try {
		// Vérifie si l'utilisateur existe déjà
		const existingUser = await AppUser.findOne({ email });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "Un utilisateur avec cet email existe déjà.",
			});
		}

		// Hache le mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		const defaultRole = await Role.findOne({ role_name: "Dresseur" });
		if (!defaultRole) {
			return res.status(500).json({
				success: false,
				message:
					"Default role not found. Please configure roles in the database.",
			});
		}

		// Crée un nouvel utilisateur
		const newUser = await AppUser.create({
			username,
			email,
			password: hashedPassword,
			role: defaultRole.id,
		});

		res.status(201).json({
			success: true,
			message: "Utilisateur créé avec succès",
			data: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
				role: newUser.role,
			},
		});
	} catch (error) {
		console.error("Erreur lors de l'enregistrement :", error.message);
		res.status(500).json({ success: false, message: "Erreur serveur" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;

	console.log("Requête reçue pour /login");

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "Please provide both email and password",
		});
	}

	try {
		const user = await AppUser.findOne({ email }).populate("role");
		console.log("Utilisateur trouvé:", user);

		// vérif du user
		if (!user) {
			console.log("Utilisateur non trouvé");
			return res
				.status(404)
				.json({ success: false, message: "Utilisateur non trouvé." });
		}

		// vérif du password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Mot de passe incorrect." });
		}
		console.log("Génération du token...");
		const accessToken = createAccessToken(user);
		console.log("Token généré :", accessToken);
		const refreshToken = createRefreshToken(user);

		// Sauvegarder le refresh token dans la base de données
		await RefreshToken.create({
			token: refreshToken,
			userId: user.id,
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				accessToken,
				refreshToken,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					role: user.role.role_name,
				},
			},
		});
	} catch (error) {
		console.error("Login error:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

// Rafraîchissement du access token avec un refresh token
export const refreshAccessToken = async (req, res) => {
	const { refreshToken } = req.body;

	// Vérifie que le refresh token est fourni
	if (!refreshToken) {
		return res
			.status(400)
			.json({ success: false, message: "Refresh token manquant." });
	}

	try {
		// Vérifier si le refresh token existe dans la base de données
		const storedToken = await RefreshToken.findOne({ token: refreshToken });
		if (!storedToken) {
			return res
				.status(403)
				.json({ success: false, message: "Refresh token invalide." });
		}

		// Vérifier la validité du refresh token
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
		// Suppression du token expiré de la base
		await RefreshToken.findOneAndDelete({ token: refreshToken });

		const newAccessToken = createAccessToken({ userId: decoded.userId });
		const newRefreshToken = createRefreshToken({ userId: decoded.userId });

		// Enregistrez le nouveau refresh token
		await RefreshToken.create({
			token: newRefreshToken,
			userId: decoded.userId,
		});

		res.status(200).json({
			success: true,
			accessToken: newAccessToken,
		});
	} catch (error) {
		console.error("Erreur lors du rafraîchissement :", error.message);
		res
			.status(403)
			.json({ success: false, message: "Refresh token invalide ou expiré." });
	}
};

// Méthode de déconnexion
export const logout = async (req, res) => {
	const { refreshToken } = req.body; // Récupère le refresh token depuis le corps de la requête

	if (!refreshToken) {
		return res.status(400).json({
			success: false,
			message: "Refresh token manquant.",
		});
	}

	try {
		// Supprimer le refresh token de la base de données
		await RefreshToken.findOneAndDelete({ token: refreshToken });

		// Réponse de succès
		res.status(200).json({
			success: true,
			message: "Déconnexion réussie.",
		});
	} catch (error) {
		console.error("Erreur lors de la déconnexion :", error.message);
		res.status(500).json({ success: false, message: "Erreur serveur." });
	}
};
