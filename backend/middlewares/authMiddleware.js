import jwt from "jsonwebtoken";

// Middleware pour authentifier l'utilisateur avec JWT
export const authenticate = (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1]; // Extraire le token de l'en-tête Authorization

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, "secret_key"); // Vérifier le token avec la clé secrète
		req.user = decoded; // Ajouter l'utilisateur décodé à req.user
		next(); // Passer au middleware suivant (isAdmin ou autre)
	} catch (error) {
		res.status(401).json({ message: "Invalid or expired token" });
	}
};

// Middleware pour vérifier si l'utilisateur est un administrateur
export const isAdmin = (req, res, next) => {
	const user = req.user; // L'utilisateur décodé précédemment par le middleware authenticate

	// Vérifie si l'utilisateur est admin
	if (user && user.role === "admin") {
		return next(); // L'utilisateur est un administrateur, on passe au middleware suivant
	}

	// Si l'utilisateur n'est pas admin, on retourne une erreur 403
	return res.status(403).json({
		success: false,
		message: "Access denied",
	});
};
