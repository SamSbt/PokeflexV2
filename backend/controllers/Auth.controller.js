import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppUser from "../models/AppUser.model.js";
import Role from "../models/Role.model.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({
			success: false,
			message: "Email et mot de passe sont requis",
		});
	}

	try {
		// Vérifie si l'utilisateur existe déjà
		const existingUser = await AppUser.findOne({ email });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "Un utilisateur avec cet email existe déjà",
			});
		}

		// Hache le mot de passe
		const hashedPassword = await bcrypt.hash(password, 10);

		const defaultRole = await Role.findOne({ default: false });
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

	if (!email || !password) {
		return res.status(400).json({
			success: false,
			message: "Please provide both email and password",
		});
	}

	try {
		const user = await AppUser.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid password" });
		}

		const payload = { userId: user.id, role: user.role };

		//TODO: modifier l'expiration !

		const secretKey = process.env.JWT_SECRET;
		//console.log("auth controller process.env.JWT_SECRET :" + secretKey);

		const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });

		res.status(200).json({
			success: true,
			message: "Login successful",
			data: { token },
		});
	} catch (error) {
		console.error("Login error:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
