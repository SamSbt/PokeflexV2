// npm init -y
// npm install express mongoose dotenv
// npm i nodemon -D (dev dependency) : run modif en tps réél

// const express = require('express');
// utilisation de ES modules (ds package.json : "type": "module",)
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import pokeflonRoutes from "./routes/pokeflon.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware - allow us to accept JSON data in the req.body
app.use(express.json());

//console.log(process.env.MONGO_URI);

app.use("/api/pokeflon", pokeflonRoutes);

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
