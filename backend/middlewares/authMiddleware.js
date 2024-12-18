import { verifyAccessToken } from "../utils/jwtUtils.js";

// Middleware pour authentifier l'utilisateur avec JWT
export const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]; // Extraire le token de l'en-tête Authorization
	console.log("Token reçu:", token);

	if (!token) {
		return res.status(401).json({ message: "Non autorisé" });
	}

	try {
		const decoded = verifyAccessToken(token);
		// decode : permet de lire le contenu, "lecture seule" kinda
		req.user = decoded; // Ajouter l'utilisateur décodé à req.user
		console.log("Utilisateur authentifié:", req.use);
		//req.role = decoded.role;
		next(); // Passer au middleware suivant
	} catch (error) {
		console.error("JWT verification error:", error);
		res.status(401).json({ message: "Token invalide ou expiré." });
	}
};

// vérif du rôle :
export const hasRole = (requiredRole) => (req, res, next) => {
	const user = req.user;
	console.log("user is :" + user.role);
	console.log("requiredRole is :" + requiredRole);
	if (user && user.role === requiredRole) {
		return next();
	}
	return res.status(403).json({
		success: false,
		message: "Accès refusé",
	});
};
