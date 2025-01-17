// npm init -y
// npm install express mongoose dotenv
// npm i nodemon -D (dev dependency) : run modif en tps réél

// const express = require('express');
// utilisation de ES modules (ds package.json : "type": "module",)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { reqLogger } from "./middlewares/Logger.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRoutes from "./routes/auth.routes.js";

import pokeflonRoutes from "./routes/pokeflon.routes.js";
import roleRoutes from "./routes/role.routes.js";
import appuserRoutes from "./routes/appuser.routes.js";
import typeRoutes from "./routes/type.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { applyTimestampToLogs } from "./utils/timestampCl.js";
applyTimestampToLogs();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json()); // allow us to accept JSON data in the req.body
app.use(cookieParser());
// CORS - permet les requêtes depuis front-end (localhost:5173)
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true, // permet l'envoi des cookies
	})
);
// CSP - Content Security Policy
// à adapter selon évolutions de l'application
app.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';; frame-ancestors 'none';"
	);
	// protection contre clickjacking
	res.setHeader("X-Frame-Options", "DENY");
	// empêche browser de deviner le type MIME des fichiers
	res.setHeader("X-Content-Type-Options", "nosniff");
	// active protection intégrée contre XSS in some older browsers
	res.setHeader("X-XSS-Protection", "1; mode=block");
	// contrôle qtté d'infors en-tête Referer transmises lors des requêtes
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
	next();
});

app.use(reqLogger);

// route pour les fichiers statiques (uploads)
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes pour l'API
app.use("/api/pokeflon", pokeflonRoutes);
app.use("/api/admin/role", roleRoutes);
app.use("/api/appuser", appuserRoutes);
app.use("/api/type", typeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:", PORT);
});

// SQL stocke des data dans des tables (rows & columns inside)
// No-SQL stocke dans des collections (documents inside)
// ex: collection 'products' & documents : 'smart watch', 'earbuds', 'shoes'...
// 2e collection ici 'users' & documents : 'John', 'Jane', 'Tim', ...
// Dans les deux cas, l'idée est de stocker et récupérer des données.
// La différence principale réside dans la flexibilité de la structure :
// - SQL force toutes les lignes à suivre le même modèle.
// - NoSQL permet à chaque document d'avoir sa propre forme.

// 1. création dossier backend et frontend
// à la racine, 3 npm du début + config dans package.json "	"type": "module","
// 2. création server.js dans backend, listen on port 5000
// 3. création MongoDB account
// 4. création .env
// 5. création config/db.js
// 6. création Models/Pokeflon.model.js & Cie
// test GET / GETbyID / POST / PUT / DELETE pokeflons dans Postman = ok
// 7. config dossier Routes et y placer all méthodes ds /Pokeflon.controller.js
// 8. idem 7. pour Role & AppUser + bcrypt pr password : npm install bcrypt
// 9. install JWT npm install jsonwebtoken pour auth middleware +
// 10. type controller & routes ok + tables associatives
// 11. installation npm install mongoose-unique-validator@latest
// need downgrader version mongoose to v7 (for now 8.8.3): npm install mongoose@7.x.x
// 12. npm install multer pr gérer les téléchargements de fichiers + middleware
// 13. init dashboard et role permissions
// 14. npm install cookie-parser pr gérer les cookies
