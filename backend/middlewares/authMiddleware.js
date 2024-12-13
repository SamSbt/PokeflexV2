import jwt from "jsonwebtoken";

// Middleware pour authentifier l'utilisateur avec JWT
export const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]; // Extraire le token de l'en-tête Authorization
	console.log("Token reçu:", token); 

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Utilise une clé secrète dans .env
		req.user = decoded; // Ajouter l'utilisateur décodé à req.user
		next(); // Passer au middleware suivant
	} catch (error) {
		console.error("JWT verification error:", error);
		res.status(401).json({ message: "Invalid or expired token" });
	}
};



// vérif du rôle :
export const hasRole = (requiredRole) => (req, res, next) => {
	const user = req.user;
	if (user && user.role === requiredRole) {
		return next();
	}
	return res.status(403).json({
		success: false,
		message: `Access denied. Requires ${requiredRole} role.`,
	});
};