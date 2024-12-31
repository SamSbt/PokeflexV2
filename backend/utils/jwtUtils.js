import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const accessTokenConfig = {
	secret: process.env.ACCESS_SECRET_TOKEN,
	expiresIn: "15m",
};
if (!process.env.ACCESS_SECRET_TOKEN) {
	console.error("ACCESS_SECRET_TOKEN is not defined in .env");
}

export const refreshTokenConfig = {
	secret: process.env.REFRESH_SECRET_TOKEN,
	expiresIn: "7d",
};

export const jwtCookieConfig = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production" ? false : true, // true en production, false en développement
	sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
	path: "/", // Chemin de validité du cookie
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
	//console.log("Start verifyAccessToken");
	try {
		const payload = jwt.verify(token, accessTokenConfig.secret);
		// verify : vérifie que le token est valide (signature correcte avec la clé secrète), si non : exception dans catch
		return payload; // Renvoie le payload vérifié
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			console.error("⚠️ Access token expired");
			throw new Error("Access token expired");
		} else if (error.name === "JsonWebTokenError") {
			console.error("Invalid access token");
			throw new Error("Invalid access token");
		} else {
			console.log("Unexpected error during token verification:", error);
			throw error;
		}
	}
};

export const verifyRefreshToken = (refreshToken) => {
	console.log("Start verifyRefreshToken");
	try {
		const payload = jwt.verify(refreshToken, refreshTokenConfig.secret);
		// verify : vérifie que le token est valide (signature correcte avec la clé secrète), si non : exception dans catch
		console.log("verifyRefreshToken refreshToken Payload:", payload);
		return payload;
	} catch (error) {
		if (error.name === "RefreshTokenExpiredError") {
			console.error("⚠️ Refresh token expired");
			throw new Error("Refresh token expired");
		} else if (error.name === "JsonWebTokenError") {
			console.error("Invalid refresh token");
			throw new Error("Invalid refresh token");
		} else {
			console.log("Error in verifyRefreshToken:");
			throw error;
		}
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

// générer le payload
const generateAccessTokenPayload = (user) => {
	if (!user || !user.role.role_name) {
		throw new Error("Invalid user data for token payload");
	}
	return { id: user._id, role_name: user.role.role_name };
};

export const decodeRefreshToken = (token) => {
	try {
		return jwt.decode(token);
	} catch (error) {
		console.error("Error decoding refresh token:", error);
		return null;
	}
};