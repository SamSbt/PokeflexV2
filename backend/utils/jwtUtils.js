import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const accessTokenConfig = {
	secret: process.env.ACCESS_SECRET_TOKEN, 
	expiresIn: "1h", 
};
if (!process.env.ACCESS_SECRET_TOKEN) {
	console.error("ACCESS_SECRET_TOKEN is not defined in .env");
}

const refreshTokenConfig = {
	secret: process.env.REFRESH_SECRET_TOKEN,
	expiresIn: "7d", 
};

// Fonction pour créer un access token
export const createAccessToken = (user) => {
	try {
		const accessTokenPayload = generateAccessTokenPayload(user);

		const accessToken = jwt.sign(accessTokenPayload, accessTokenConfig.secret, {
			expiresIn: accessTokenConfig.expiresIn,
		});

		console.log("Generated new Access Token");
		return accessToken;
	} catch (error) {
		console.error("Error generating access token:", error);
		throw error;
	}
};

// Fonction pour vérifier un access token
export const verifyAccessToken = (token) => {
	console.log("Start verifyAccessToken");
	try {
		const payload = jwt.verify(token, accessTokenConfig.secret);
		// verify : vérifie que le token est valide (signature correcte avec la clé secrète), si non : exception dans catch
		console.log("Payload:", payload);
		// Ici tu peux ajouter une logique de validation selon ton besoin
		return payload; // Renvoie le payload vérifié
	} catch (error) {
		console.log("Error in verifyAccessToken:");
		throw error;
	}
};

// Fonction pour créer un refresh token
export const createRefreshToken = (user) => {
	try {
		const refreshTokenPayload = { userId: user.id };

		const refreshToken = jwt.sign(
			refreshTokenPayload,
			refreshTokenConfig.secret,
			{
				expiresIn: refreshTokenConfig.expiresIn,
			}
		);

		console.log("Generated new Refresh Token");
		return refreshToken;
	} catch (error) {
		console.error("Error generating refresh token:", error);
		throw error;
	}
};

// Fonction pour générer le payload
// function generateAccessTokenPayload(user) {
// 	return {
// 		id: user.id,
// 		role: user.role.role_name,
// 	};
// }
const generateAccessTokenPayload = (user) => {
	if (!user || !user.role_name) {
		throw new Error("Invalid user data for token payload");
	}
	return { id: user._id, role_name: user.role_name };
};
