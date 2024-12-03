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

export const getOnePokeflon = async (req, res) => {
	const { id } = req.params;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid Pokeflon Id" });
	}

	try {
		// recherche Pokéflon par ID
		const pokeflons = await Pokeflon.findById(id);

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
	const pokeflons = req.body; // données envoyées par l'utilisateur

	console.log("Received Pokeflon data:", pokeflons);

	// vérif des required
	if (
		!pokeflons.name ||
		!pokeflons.sound ||
		!pokeflons.height ||
		!pokeflons.weight ||
		!pokeflons.summary ||
		!pokeflons.img_src ||
		!pokeflons.types ||
		pokeflons.types.length === 0
	) {
		return res
			.status(400)
			.json({
				success: false,
				message: "Please provide all required fields, including types.",
			});
	}

	// TODO : validations à garder ici ET en front ?
	// conversion 'height' et 'weight' en nbs avec 2 décimales
	//pokeflons.height = parseFloat(pokeflons.height).toFixed(2); // Limite à 2 décimales et reconvertit en nombre
	//pokeflons.weight = parseFloat(pokeflons.weight).toFixed(2);
	// validation URL image
	// TODO : véérif si URL + img perso de l'ordi à insérer
	// const urlRegex = /^(https?:\/\/)?([\w\d-]+)\.([a-z]{2,})/i;
	// if (pokeflons.img_src && !urlRegex.test(pokeflons.img_src)) {
	// 	return res
	// 		.status(400)
	// 		.json({ success: false, message: "Image URL is not valid." });
	// }

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

		// Récupération des types sélectionnés
		const types = await Type.find({ _id: { $in: pokeflons.types } });

		// Vérification que tous les types existent dans la base
		if (types.length !== pokeflons.types.length) {
			return res.status(400).json({
				success: false,
				message: "One or more selected types do not exist.",
			});
		}

		// Création des relations dans la table associative `type_pokeflon`
		for (const type of types) {
			const newTypePokeflon = new TypePokeflon({
				id_type: type._id,
				id_pokeflon: newPokeflon._id,
			});
			await newTypePokeflon.save();
		}

		res.status(201).json({
			success: true,
			message: `Pokeflon created successfully: ${newPokeflon.name}`,
			data: newPokeflon,
		});
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
					updatedAt: new Date(), // force maj de updated_at
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

		res
			.status(200)
			.json({
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
