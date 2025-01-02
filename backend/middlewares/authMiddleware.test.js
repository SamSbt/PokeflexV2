// installation à la racine npm install --save-dev jest
// fichiers de config à la racine : back, et front pour plus tard
// scripts et type ajoutés dans package.json à la racine
// npm install dotenv --save-dev (obligatoire pour les tests)
// création fichier autMiddleware.test dans middlewares folder
// npm run test:backend ou npm run test:frontend
// écriture des tests authenticate et hasRole

import { jest } from "@jest/globals";
import mongoose from "mongoose";

// test 1
// Mock de verifyAccessToken
jest.mock("../utils/jwtUtils.js", () => ({
	verifyAccessToken: jest.fn(),

}));
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";
import * as jwtUtils from "../utils/jwtUtils.js";

global.fetch = jest.fn(); // mock global pour fetch

describe("Middleware authenticate", () => {
	let req, res, next;

beforeEach(() => {
	req = {
		header: jest.fn(),
		cookies: {},
	};
	res = {
		status: jest.fn().mockReturnThis(),
		json: jest.fn(),
	};
	next = jest.fn();
	jest.clearAllMocks();
});

	it("renvoie 401 si aucun token ou refresh token n'est fourni", async () => {
		req.header.mockReturnValue(undefined);

		await authenticate(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: "Non autorisé" });
		expect(next).not.toHaveBeenCalled();
	});

	it("autorise si le token est valide", async () => {
		const mockUser = { id: "123", role: "User" };

		jwtUtils.verifyAccessToken.mockReturnValue(mockUser);
		req.header.mockReturnValue("Bearer valid_token");

		await authenticate(req, res, next);

		expect(jwtUtils.verifyAccessToken).toHaveBeenCalledWith("valid_token");
		expect(req.user).toEqual(mockUser);
		expect(next).toHaveBeenCalled();
	});

	it("rafraîchit le token si l'access token est invalide et le refresh token est valide", async () => {
		req.header.mockReturnValue(undefined);
		req.cookies.jwt = "valid_refresh_token";
		const mockNewToken = "new_access_token";
		const mockUser = { id: "123", role: "User" };

		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ token: mockNewToken }),
		});
		jwtUtils.verifyAccessToken.mockReturnValue(mockUser);

		await authenticate(req, res, next);

		expect(global.fetch).toHaveBeenCalledWith(
			`${process.env.API_URL}/auth/refresh`,
			{
				method: "POST",
				credentials: "include",
			}
		);
		expect(jwtUtils.verifyAccessToken).toHaveBeenCalledWith(mockNewToken);
		expect(req.user).toEqual(mockUser);
		expect(req.headers.authorization).toBe(`Bearer ${mockNewToken}`);
		expect(next).toHaveBeenCalled();
	});

	it("renvoie 401 si le refresh token est invalide", async () => {
		req.header.mockReturnValue(undefined);
		req.cookies.jwt = "invalid_refresh_token";

		fetch.mockResolvedValueOnce({ ok: false });

		await authenticate(req, res, next);

		expect(fetch).toHaveBeenCalledWith(`${process.env.API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Token invalide ou expiré.",
		});
		expect(next).not.toHaveBeenCalled();
	});

	it("renvoie 401 si le header Authorization est mal formé", async () => {
		req.header.mockReturnValue("Token invalid_token");

		await authenticate(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({
			message: "Token invalide ou expiré.",
		});
		expect(next).not.toHaveBeenCalled();
	});
});

// test 2
describe("hasRole Middleware", () => {
	let req, res, next;

	beforeEach(() => {
		req = { user: null }; // Simuler une requête avec ou sans utilisateur
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		}; // Simuler la réponse
		next = jest.fn(); // Mock pour next()
	});

	it("autorise l'accès si l'utilisateur a le rôle requis", () => {
		req.user = { role_name: "Dresseur" }; // Simuler un utilisateur avec le rôle "Dresseur"
		const middleware = hasRole("Dresseur");

		middleware(req, res, next);

		expect(next).toHaveBeenCalled(); // Vérifie que next() a été appelé
		expect(res.status).not.toHaveBeenCalled(); // Vérifie que la réponse n'a pas été modifiée
	});

	it("autorise l'accès si l'utilisateur est Admin", () => {
		req.user = { role_name: "Admin" }; // Simuler un utilisateur admin
		const middleware = hasRole("Dresseur");

		middleware(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
	});

	it("refuse l'accès si l'utilisateur n'a pas le rôle requis", () => {
		req.user = { role_name: "Visiteur" }; // Simuler un utilisateur avec un rôle incorrect
		const middleware = hasRole("Dresseur");

		middleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403); // Vérifie que le statut 403 est retourné
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Accès refusé",
		});
		expect(next).not.toHaveBeenCalled(); // Vérifie que next() n'a pas été appelé
	});

	it("refuse l'accès si l'utilisateur n'est pas authentifié", () => {
		req.user = null; // Aucun utilisateur
		const middleware = hasRole("Dresseur");

		middleware(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			success: false,
			message: "Accès refusé",
		});
		expect(next).not.toHaveBeenCalled();
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
