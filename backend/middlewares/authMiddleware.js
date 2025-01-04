import { verifyAccessToken } from "../utils/jwtUtils.js";

// middleware pour authentifier l'utilisateur avec JWT
export const authenticate = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	//console.log("Token reçu:", token);

	console.log("middleware authenticate ❌");
	if (!token) {
		console.log("missing access  token in authenticate middleware💀");
		return res
			.status(401)
			.json({ message: "Non autorisé : access token non obtenu." });
		// va renvoyer une réponse 401 avec un message d'erreur
		// le front va recevoir le 401 et lancer un refresh de l'acces token puis relancer la requête initiale
	}

	try {
		console.log("verify access token...😣");
		//si le decoded ne passe pas, la fonction va renvoyer un 401 géré par le front
		const decoded = verifyAccessToken(token);
		console.log("👍Token décodé avec succès.");

		req.user = decoded; // add user décodé à req.user
		return next(); // Passer au middleware suivant
	} catch (error) {
		console.error("Error in authentication middleware:", error.message);
		res.status(401).json({ message: "😣 Token invalide ou expiré." });
	}
};


export const hasRole = (requiredRole) => (req, res, next) => {
	const user = req.user;
	console.log("Contenu de req.user :", user);

	if (!user) {
		console.log("Utilisateur non authentifié");
		return res.status(403).json({
			success: false,
			message: "Accès refusé : utilisateur non authentifié.",
		});
	}

	console.log("user is :", user.role_name);
	//console.log("requiredRole is :", requiredRole);

	if (user.role_name === requiredRole || user.role_name === "Admin") {
		return next();
	}

	return res.status(403).json({
		success: false,
		message: "Accès refusé : permissions insuffisantes.",
	});
};
