import { verifyAccessToken } from "../utils/jwtUtils.js";

// Middleware pour authentifier l'utilisateur avec JWT
export const authenticate = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]; // Extraire le token de l'en-tête Authorization
	console.log("Token reçu:", token);
	const refreshToken = req.cookies.jwt;

	if (!token && !refreshToken) {
		return res.status(401).json({ message: "Non autorisé" });
	}

	try {
		if (token) {
			const decoded = verifyAccessToken(token);
			console.log("👍Token décodé avec succès.", decoded);
			// decode : permet de lire le contenu, "lecture seule" kinda
			// if (!decoded.id) {
			// 	return res.status(401).json({ message: "Token invalide ou expiré." });
			// }
			req.user = decoded; // Ajouter l'utilisateur décodé à req.user
			console.log("Utilisateur décodé:", decoded);
			return next(); // Passer au middleware suivant
		}

		// si access token non valide, refresh
		const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Refresh token invalid");
		}

		const data = await response.json();
		req.user = verifyAccessToken(data.token);
		req.headers.authorization = `Bearer ${data.token}`;
		next();
	} catch (error) {
		console.error("Erreur d'authentification :", error);
		res.status(401).json({ message: "Token invalide ou expiré." });
	}
};

// vérif du rôle :
export const hasRole = (requiredRole) => (req, res, next) => {
	const user = req.user;
	//console.log("Contenu de req.user :", user);
	//console.log("user is :", user.role_name);
	//console.log("requiredRole is :", requiredRole);

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
