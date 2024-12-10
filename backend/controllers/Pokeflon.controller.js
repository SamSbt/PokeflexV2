import mongoose from "mongoose";
import Pokeflon from "../models/Pokeflon.model.js";

export const getPokeflons = async (req, res) => {
	try {
		const pokeflons = await Pokeflon.find({}); // empty {} here : fetch ALL pokeflons
		res.status(200).json({ success: true, data: pokeflons });
	} catch (error) {
		console.log("Error in fetching Pokeflons:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getOnePokeflon = async (req, res) => {
	const { id } = req.params;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid Pokeflon Id" });
	}

	try {
		// recherche du Pokéflon par ID et peuplement des types
		const pokeflons = await Pokeflon.findById(id)
			.populate({
				path: "types", // Charge les types associés à ce Pokéflon
				select: "type_name", // On sélectionne uniquement le nom des types pour l'affichage
			})
			.exec();

		// si le Pokéflon n'existe pas
		if (!pokeflons) {
			return res
				.status(404)
				.json({ success: false, message: "Pokeflon not found" });
		}

		res.status(200).json({ success: true, data: pokeflons });
	} catch (error) {
		console.log("Error in fetching Pokeflon by ID:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const postPokeflon = async (req, res) => {
	try {
		const pokeflons = req.body; // pokeflons est l'objet contenant les données du formulaire
		const file = req.file; // Le fichier téléchargé est dans req.file
		console.log("req.body:", req.body);
		console.log("req.file:", req.file);

		if (!req.body || !req.body.pokeflons) {
			return res.status(400).json({
				success: false,
				message: "Missing Pokeflon data in request body.",
			});
		}

		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded." });
		}

		// Vérification des champs requis
		if (
			!pokeflons.name ||
			!pokeflons.sound ||
			!pokeflons.height ||
			!pokeflons.weight ||
			!pokeflons.summary ||
			!pokeflons.type1
		) {
			return res.status(400).json({
				success: false,
				message: "Please provide all required fields.",
			});
		}

		// TODO : validations à garder ici ET en front ?
		// empêcher d'aller en dessous de 0 ou lettres interdites
		if (
			!/^\d+(\.\d+)?$/.test(pokeflons.height) ||
			parseFloat(pokeflons.height) <= 0
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid height value. Only numbers are allowed.",
			});
		}

		if (
			!/^\d+(\.\d+)?$/.test(pokeflons.weight) ||
			parseFloat(pokeflons.weight) <= 0
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid weight value. Only numbers are allowed.",
			});
		}

		// TODO : validation des références aux utilisateurs (created_by et appuser)
		// const createdByExists = mongoose.Types.ObjectId.isValid(pokeflons.created_by);
		// const appUserExists = mongoose.Types.ObjectId.isValid(pokeflons.appuser);
		// 	if (!createdByExists || !appUserExists) {
		// 		return res
		// 			.status(400)
		// 			.json({ success: false, message: "Invalid user references." });
		// 	}

		// récupération des types
		//const types = [pokeflons.type1, pokeflons.type2];
		const types = [pokeflons.type1];

		if (pokeflons.type2) {
			types.push(pokeflons.type2); // Ajoute type2 seulement s'il est fourni
		}

		pokeflons.types = types; // Assigne le tableau de types à l'objet Pokéflon

		// création du Pokéflon avec les types directement
		const newPokeflon = new Pokeflon({
			name: pokeflons.name,
			sound: pokeflons.sound,
			height: parseFloat(pokeflons.height).toFixed(2), //nbs avec 2 décimales
			weight: parseFloat(pokeflons.weight).toFixed(2),
			summary: pokeflons.summary,
			img_src: file ? `/uploads/${file.filename}` : null,
			types: types,
		});

		// Sauvegarde du Pokéflon avec les types associés
		console.log("Saving new Pokeflon to database...");
		const savedPokeflon = await newPokeflon.save();

		res.status(201).json({
			success: true,
			message: `Pokeflon created successfully: ${savedPokeflon.name}`,
			data: savedPokeflon,
		});
	} catch (error) {
		console.error("Erreur lors de la création :", response.statusText);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const putPokeflon = async (req, res) => {
	const { id } = req.params;
	const pokeflons = req.body;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid Pokeflon Id" });
	}

	try {
		const updatedPokeflon = await Pokeflon.findByIdAndUpdate(
			id,
			{
				$set: {
					...pokeflons,
				},
			},
			{
				new: true, // return l'objet mis à jour
				runValidators: true, // valide changements selon règles du model
			}
		);

		// id pokeflon non trouvé
		if (!updatedPokeflon) {
			return res
				.status(404)
				.json({ success: false, message: "Pokeflon not found" });
		}

		res.status(200).json({
			success: true,
			message: "Pokeflon successfully updated.",
			data: updatedPokeflon,
		});
	} catch (error) {
		console.error("Error in updating Pokeflon:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deletePokeflon = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid Pokeflon Id" });
	}

	try {
		const pokeflons = await Pokeflon.findById(id); // TODO: findByIdAndDelete(id) une fois que CORBEILLE implémentée

		// si le Pokéflon n'existe pas
		if (!pokeflons) {
			return res
				.status(404)
				.json({ success: false, message: "Pokeflon not found" });
		}

		// on marque pokeflon comme suppr, et on marque la date
		pokeflons.is_deleted = true;
		pokeflons.deleted_at = new Date();
		// on save les modifs
		await pokeflons.save();

		res
			.status(200)
			.json({ success: true, message: "Pokeflon marked as deleted" });
	} catch (error) {
		console.log("Error in deleting Pokeflon:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
