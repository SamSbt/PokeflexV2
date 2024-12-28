import { verifyAccessToken } from "../utils/jwtUtils.js";

// Middleware pour authentifier l'utilisateur avec JWT
export const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]; // Extraire le token de l'en-tête Authorization
	console.log("Token reçu:", token);

	if (!req.header("Authorization") || !token) {
		console.error("Authorization header or token is missing");
		return res.status(401).json({ message: "Non autorisé" });
	}

	try {
		const decoded = verifyAccessToken(token);
		console.log("👍Token décodé avec succès.", decoded);
		// decode : permet de lire le contenu, "lecture seule" kinda
		if (!decoded.id) {
			return res.status(401).json({ message: "Token invalide ou expiré." });
		}
		req.user = decoded; // Ajouter l'utilisateur décodé à req.user
		console.log("Utilisateur décodé:", decoded);
		//req.role = decoded.role;
		next(); // Passer au middleware suivant
	} catch (error) {
		console.error("Erreur de vérification du token :", error);
		res.status(401).json({ message: "Token invalide ou expiré." });
	}
};

// vérif du rôle :
export const hasRole = (requiredRole) => (req, res, next) => {
	const user = req.user;
	//console.log("Contenu de req.user :", user);
	console.log("user is :", user.role_name);
	console.log("requiredRole is :", requiredRole);
	

	if (
		user &&
		user.role_name &&
		(user.role_name === requiredRole || user.role_name === "Admin")
	) {
		return next();
	}
	console.log("Rôle de l'utilisateur:", user.role_name);
	return res.status(403).json({
		success: false,
		message: "Accès refusé",
	});
};
