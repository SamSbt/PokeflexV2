import { verifyAccessToken } from "../utils/jwtUtils.js";

// middleware pour authentifier l'utilisateur avec JWT
export const authenticate = async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	console.log("Token reçu:", token);
	
	//pas focement utile d'avoir le refresh token si vous n'en avez pas besoin
	const refreshToken = req.cookies.jwt;


	console.log("refresh token reçu:", refreshToken);
console.log("middleware authenticate ❌");
	if (!token && !refreshToken) {
		console.log("missing token in authenticate middleware💀");
		return res.status(401).json({ message: "Non autorisé" });
		//401 va renvoyer une réponse 401 avec un message d'erreur
		//le front va recevoir le 401 et lancer un refresh de l'acces token puis relancer la requête initiale
	}

	try {
		if (token) {
			console.log("starting to verify access token...😣");
			//si le decoded passe pas, la fonction va renvoyer un 401 gerer par le fron
			const decoded = verifyAccessToken(token);
			console.log("👍Token décodé avec succès.", decoded);
	
			req.user = decoded; // Ajouter l'utilisateur décodé à req.user
			console.log("Utilisateur décodé:", decoded);
			return next(); // Passer au middleware suivant
		}

		// // si access token non valide, refresh
		// const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
		// 	method: "POST",
		// 	credentials: "include",
		// });

		// if (!response.ok) {
		// 	throw new Error("Refresh token invalid");
		// }

		// const data = await response.json();
		// req.user = verifyAccessToken(data.token);
		// req.headers.authorization = `Bearer ${data.token}`;
		// console.log("auth middleware passed 👉");
		next();
	} catch (error) {
		res.status(401).json({ message: "😣 Token invalide ou expiré." });
	}
};

// vérif du rôle :
export const hasRole = (requiredRole) => (req, res, next) => {
	const user = req.user;
	console.log("Contenu de req.user :", user);
	console.log("user is :", user.role_name);
	//console.log("requiredRole is :", requiredRole);

	if (
		user &&
		user.role_name &&
		(user.role_name === requiredRole || user.role_name === "Admin")
	) {
		return next();
	}
	//console.log("Rôle de l'utilisateur:", user.role_name);
	return res.status(403).json({
		success: false,
		message: "Accès refusé",
	});
};
