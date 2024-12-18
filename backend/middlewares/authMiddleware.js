import jwt from "jsonwebtoken";

// Middleware pour authentifier l'utilisateur avec JWT
export const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]; // Extraire le token de l'en-tête Authorization
	console.log("Token reçu:", token);

	if (!token) {
		return res.status(401).json({ message: "Non autorisé" });
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN); // Utilise une clé secrète dans .env
		// decode : permet de lire le contenu (payload), "lecture seule" kinda
		// verify : vérifie que le token est valide (signature correcte avec la clé secrète), si non : exception dans catch
		//console.log("auth middleware process.env.ACCESS_SECRET_TOKEN :" + process.env.ACCESS_SECRET_TOKEN);
		req.user = decoded; // Ajouter l'utilisateur décodé à req.user
		console.log("req.user ici is :" + req.user);
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
