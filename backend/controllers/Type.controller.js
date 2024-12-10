import mongoose from "mongoose";
import Type from "../models/Type.model.js";

export const getTypes = async (req, res) => {
	try {
		const types = await Type.find({ is_deleted: false }); // si empty {} : fetch ALL types
		res.status(200).json({ success: true, data: types });
	} catch (error) {
		console.log("Error in fetching types:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getOneType = async (req, res) => {
	const { id } = req.params;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid type Id" });
	}

	try {
		// recherche type par ID
		const types = await Type.findById(id);

		// si le type n'existe pas
		if (!types) {
			return res
				.status(404)
				.json({ success: false, message: "Type not found" });
		}

		res.status(200).json({ success: true, data: types });
	} catch (error) {
		console.log("Error in fetching type by ID:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const postType = async (req, res) => {
	const types = req.body; // données envoyées par l'utilisateur

	console.log("Received type data:", types);
	// création new type
	const newType = new Type(types);

	try {
		console.log("Saving new type to database...");
		await newType.save();
		res.status(201).json({
			success: true,
			message: `Type created successfully: ${newType.type_name}`,
			data: newType,
		});
	} catch (error) {
		console.error("Error in Create type:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const putType = async (req, res) => {
	const { id } = req.params;
	const types = req.body;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid type Id" });
	}

	try {
		const updatedType = await Type.findByIdAndUpdate(
			id,
			{
				$set: {
					...types,
				},
			},
			{
				new: true, // return l'objet mis à jour
				runValidators: true, // valide changements selon règles du model
			}
		);

		// id type non trouvé
		if (!updatedType) {
			return res
				.status(404)
				.json({ success: false, message: "Type not found" });
		}

		res.status(200).json({
			success: true,
			message: "Type successfully updated.",
			data: updatedType,
		});
	} catch (error) {
		console.error("Error in updating type:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteType = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid type Id" });
	}

	try {
		const types = await Type.findById(id);

		// si le type n'existe pas
		if (!types) {
			return res
				.status(404)
				.json({ success: false, message: "Type not found" });
		}

		// Si le type est déjà supprimé
		if (types.is_deleted) {
			return res.status(400).json({
				success: false,
				message: "Type has already been deleted",
			});
		}

		//soft delete
		types.is_deleted = true;
		await types.save();

		res
			.status(200)
			.json({ success: true, message: "Type successfully deleted" });
	} catch (error) {
		console.log("Error in deleting type:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
