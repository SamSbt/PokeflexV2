import mongoose from "mongoose";
import Pokeflon from "../models/Pokeflon.model.js";

export const getPokeflon = async (req, res) => {
	try {
		const pokeflons = await Pokeflon.find({}); // empty {} here : fetch ALL pokeflons
		res.status(200).json({ success: true, data: pokeflons });
	} catch (error) {
		console.log("Error in fetching Pokeflons:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const postPokeflon = async (req, res) => {
	const pokeflons = req.body; //user will send this data

	console.log("Received Pokeflon data:", pokeflons);

	// vérif des required
	if (
		!pokeflons.name ||
		!pokeflons.sound ||
		!pokeflons.height ||
		!pokeflons.weight ||
		!pokeflons.summary ||
		!pokeflons.img_src
	) {
		return res
			.status(400)
			.json({ success: false, message: "Please provide all required fields" });
	}

	// vérif 'height' et 'weight' = nombres
	if (
		(pokeflons.height && typeof pokeflons.height !== "number") ||
		(pokeflons.weight && typeof pokeflons.weight !== "number")
	) {
		return res
			.status(400)
			.json({ success: false, message: "Height and weight must be numbers." });
	}
	// conversion 'height' et 'weight' en nbs avec 2 décimales
	pokeflons.height = parseFloat(pokeflons.height).toFixed(2); // Limite à 2 décimales et reconvertit en nombre
	pokeflons.weight = parseFloat(pokeflons.weight).toFixed(2);

	// validation URL image
	const urlRegex = /^(https?:\/\/)?([\w\d-]+)\.([a-z]{2,})/i;
	if (pokeflons.img_src && !urlRegex.test(pokeflons.img_src)) {
		return res
			.status(400)
			.json({ success: false, message: "Image URL is not valid." });
	}

	// TODO : validation des références aux utilisateurs (created_by et appuser)
	// const createdByExists = mongoose.Types.ObjectId.isValid(pokeflons.created_by);
	// const appUserExists = mongoose.Types.ObjectId.isValid(pokeflons.appuser);
	// 	if (!createdByExists || !appUserExists) {
	// 		return res
	// 			.status(400)
	// 			.json({ success: false, message: "Invalid user references." });
	// 	}

	// création new pokeflon
	const newPokeflon = new Pokeflon(pokeflons);

	try {
		console.log("Saving new Pokeflon to database...");
		await newPokeflon.save();
		console.log("Pokeflon saved successfully:", newPokeflon);
		res.status(201).json({ success: true, data: newPokeflon });
	} catch (error) {
		console.error("Error in Create Pokeflon:", error.message);
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
					updatedAt: new Date(), // Force la mise à jour de updatedAt
				},
			},
			{
				new: true, // Retourne l'objet mis à jour
				runValidators: true, // Valide les changements selon les règles du modèle
			}
		);

		// id pokeflon non trouvé
		if (!updatedPokeflon) {
			return res
				.status(404)
				.json({ success: false, message: "Pokeflon not found" });
		}

		res.status(200).json({ success: true, data: updatedPokeflon });
	} catch (error) {
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deletedPokeflon = async (req, res) => {
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

		// on marque pkfl comme suppr, et on marque la date
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
