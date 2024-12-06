// npm init -y
// npm install express mongoose dotenv
// npm i nodemon -D (dev dependency) : run modif en tps réél

// const express = require('express');
// utilisation de ES modules (ds package.json : "type": "module",)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import pokeflonRoutes from "./routes/pokeflon.routes.js";
import roleRoutes from "./routes/role.routes.js";
import appuserRoutes from "./routes/appuser.routes.js";
import userRoutes from "./routes/userRoutes.js";
import typeRoutes from "./routes/type.routes.js";
import contactRoutes from "./routes/contact.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware - allow us to accept JSON data in the req.body
app.use(express.json());

//console.log(process.env.MONGO_URI);

// CORS - permet les requêtes depuis front-end (localhost:5173)
app.use(
	cors({
		origin: "http://localhost:5173",
	})
);

app.use("/api/pokeflon", pokeflonRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/appuser", appuserRoutes);
app.use("/api", userRoutes);
app.use("/api/type", typeRoutes);
app.use("/api/contact", contactRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server started at http://localhost:" + PORT);
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
// création userController et userRoutes pr changer rôles depuis back end
// 10. type controller & routes ok + tables associatives
