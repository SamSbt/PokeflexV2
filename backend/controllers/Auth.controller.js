import bcrypt from "bcrypt";
import AppUser from "../models/AppUser.model.js";
import Role from "../models/Role.model.js";
import {
	createAccessToken,
	createRefreshToken,
	jwtCookieConfig,
	verifyRefreshToken,
} from "../utils/jwtUtils.js";

// const isDevelopment = true;

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // 5min
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
console.log("NODE_ENV dans Auth.controller:", process.env.NODE_ENV);
const isDevelopment =
	true || process.env.NODE_ENV?.toLowerCase() === "development";
console.log("isDevelopment dans Auth.controller:", isDevelopment);


export const register = async (req, res) => {
	console.log("Début de la fonction register");
	console.log("isDevelopment dans register:", isDevelopment);
	const { username, email, password, recaptchaResponse } = req.body;
	//console.log("req.body ds auth controller :", req.body);

	if (!username || !email || !password) {
		return res.status(400).json({
			success: false,
			message: "Le nom d'utilisateur, l'email et le mot de passe sont requis.",
		});
	}

	try {
		// Vérifie si l'utilisateur existe déjà (email ou username)
		const existingUser = await AppUser.findOne({
			$or: [{ email }, { username }],
		});
		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(409).json({
					success: false,
					message: "Un utilisateur avec cet email existe déjà.",
				});
			}
			if (existingUser.username === username) {
				return res.status(409).json({
					success: false,
					message: "Ce nom d'utilisateur est déjà pris.",
				});
			}
		}



		if (isDevelopment) {
            console.log("Mode développement : contournement de la vérification reCAPTCHA");
        } else {
					// Vérifie que la réponse du reCAPTCHA est présente
					if (!recaptchaResponse) {
						return res.status(400).json({
							success: false,
							message: "Le reCAPTCHA est requis.",
						});
					}

					// Valider la réponse du reCAPTCHA auprès de Google
					const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
					const googleResponse = await fetch(verifyUrl, { method: "POST" });
					const googleResult = await googleResponse.json();

					// si validation reCAPTCHA échoue = erreur
					if (!googleResult.success) {
						return res.status(400).json({
							success: false,
							message: "reCAPTCHA invalide.",
						});
					}
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
		// vérif du user
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Utilisateur non trouvé." });
		}

		// vérif si compte verrouillé
		if (user.isLocked()) {
			return res.status(403).json({
				success: false,
				message: `Compte verrouillé. Réessayez dans ${Math.ceil(
					(user.lockUntil - Date.now()) / 1000
				)} secondes.`,
			});
		}

		// vérif du password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			// Incrémenter le nombre de tentatives échouées
			user.failedAttempts += 1;

			// si échecs > limite, verrouillage du compte
			if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
				user.lockUntil = Date.now() + LOCK_TIME; // Verrouillage du compte pour 5min
			}

			// save any changes
			await user.save();

			return res.status(401).json({
				success: false,
				message: "Mot de passe incorrect.",
			});
		}

		// réinitialiser échecs & verrouillage si connexion successful
		user.failedAttempts = 0;
		user.lockUntil = null;
		await user.save();

		console.log("Génération de l'acces token...");
		const accessToken = createAccessToken(user);
		console.log("👍 acces Token généré :", accessToken);
		console.log("Génération du refresh token...");
		const refreshToken = createRefreshToken(user);
		console.log("👍 refreshToken généré :", refreshToken);

		res.cookie("jwt", refreshToken, jwtCookieConfig); 
		console.log("Setting refresh token cookie:", {
			name: "jwt",
			options: jwtCookieConfig,
		});
		res.status(200).json({
			success: true,
			message: "Login successful",
			data: {
				accessToken,
				// ne jamais mettre le refresh token ici
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
	console.log("🤔🤔 Requête reçue pour /refresh");
	const cookies = req.cookies;
	const refreshToken = cookies.jwt;

	if (!refreshToken) {
		return res
			.status(403)
			.json({ success: false, message: "Refresh token manquant." });
	}

	try {
		// Vérifier la validité du refresh token
		const payload = verifyRefreshToken(refreshToken);
		const user = await AppUser.findById(payload.userId).populate("role");
		const newAccessToken = createAccessToken(user);
		res.status(200).json({
			success: true,
			accessToken: newAccessToken,
		});

		console.log("💵 Nouvel acces token généré :", newAccessToken);
	} catch (error) {
		console.error("Erreur lors du rafraîchissement :", error.message);
		res
			.status(403)
			.json({ success: false, message: "Refresh token invalide ou expiré." });
	}
};

// Méthode de déconnexion
export const logout = async (req, res) => {
	res.clearCookie("jwt", jwtCookieConfig);
	const { refreshToken } = req.body; // Récupère le refresh token depuis le corps de la requête

	if (!refreshToken) {
		return res.status(400).json({
			success: false,
			message: "Refresh token manquant.",
		});
	}

	try {
		// Supprimer le refresh token de la base de données
		await refreshToken.findOneAndDelete({ token: refreshToken });

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
