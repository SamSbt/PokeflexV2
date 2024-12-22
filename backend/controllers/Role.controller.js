import mongoose from "mongoose";
import Role from "../models/Role.model.js";

export const getRoles = async (req, res) => {
	console.log("Fetching all roles...✨✨");
	try {
		const roles = await Role.find({}); // empty {} here : fetch ALL roles
		res.status(200).json({ success: true, data: roles });
		console.log("Roles fetched successfully! 🥇");
	} catch (error) {
		console.log("Error in fetching roles:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getOneRole = async (req, res) => {
	const { id } = req.params;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid role Id" });
	}

	try {
		// recherche role par ID
		const roles = await Role.findById(id);

		// si le role n'existe pas
		if (!roles) {
			return res
				.status(404)
				.json({ success: false, message: "Role not found" });
		}

		res.status(200).json({ success: true, data: roles });
	} catch (error) {
		console.log("Error in fetching role by ID:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const postRole = async (req, res) => {
	const roles = req.body; // données envoyées par l'utilisateur

	console.log("Received role data:", roles);
	// création new role
	const newRole = new Role(roles);

	try {
		console.log("Saving new role to database...");
		await newRole.save();
		res.status(201).json({
			success: true,
			message: `Role created successfully: ${newRole.role_name}`,
			data: newRole,
		});
	} catch (error) {
		console.error("Error in Create role:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const putRole = async (req, res) => {
	const { id } = req.params;
	const roles = req.body;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid role Id" });
	}

	try {
		const updatedRole = await Role.findByIdAndUpdate(
			id,
			{
				$set: {
					...roles,
				},
			},
			{
				new: true, // return l'objet mis à jour
				runValidators: true, // valide changements selon règles du model
			}
		);

		// id role non trouvé
		if (!updatedRole) {
			return res
				.status(404)
				.json({ success: false, message: "Role not found" });
		}

		res.status(200).json({
			success: true,
			message: "Role successfully updated.",
			data: updatedRole,
		});
	} catch (error) {
		console.error("Error in updating role:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteRole = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid role Id" });
	}

	try {
		const roles = await Role.findById(id);

		// si le role n'existe pas
		if (!roles) {
			return res
				.status(404)
				.json({ success: false, message: "Role not found" });
		}

		//soft delete
		roles.is_deleted = true;
		await roles.save();

		res
			.status(200)
			.json({ success: true, message: "Role successfully deleted" });
	} catch (error) {
		console.log("Error in deleting role:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
