import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppUser from "../models/AppUser.model.js";

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

		const payload = { userId: user._id, role: user.role };

//TODO: modifier l'expiration !

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: "24h",
		});

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
