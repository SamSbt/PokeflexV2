import mongoose from "mongoose";
import bcrypt from "bcrypt";
import AppUser from "../models/AppUser.model.js";

export const getAppUsers = async (req, res) => {
	try {
		const appusers = await AppUser.find({}); // empty {} here : fetch ALL appusers
		res.status(200).json({ success: true, data: appusers });
	} catch (error) {
		console.log("Error in fetching AppUsers:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const getOneAppUser = async (req, res) => {
	const { id } = req.params;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid AppUser Id" });
	}

	try {
		// recherche appuser par ID
		const appusers = await AppUser.findById(id);

		// si l appuser n'existe pas
		if (!appusers) {
			return res
				.status(404)
				.json({ success: false, message: "AppUser not found" });
		}

		res.status(200).json({ success: true, data: appusers });
	} catch (error) {
		console.log("Error in fetching AppUser by ID:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const postAppUser = async (req, res) => {
	const appusers = req.body; // données envoyées par l'utilisateur

	console.log("Received AppUser data:", appusers);

	// vérif des required
	if (!appusers.username || !appusers.email || !appusers.password) {
		return res
			.status(400)
			.json({ success: false, message: "Please provide all required fields" });
	}

	// vérif si l'email existe déjà - ds model, la vérif n'est pas à l'instant T de connexion
	try {
		const existingAppUser = await AppUser.findOne({ email: appusers.email });
		if (existingAppUser) {
			return res.status(400).json({
				success: false,
				message:
					"This email is already taken, please use a different email address.",
			});
		}

		// Recherche de l'ObjectId du rôle 'dresseur' dans la collection Role
		const defaultRole = await Role.findOne({ name: "Dresseur" });
		if (!defaultRole) {
			return res.status(500).json({
				success: false,
				message:
					"Default role 'dresseur' not found. Please configure roles in the database.",
			});
		}

		// hachage du mot de passe avant save, + gestion d'erreurs
		let hashedPassword;
		try {
			const salt = await bcrypt.genSalt(10);
			hashedPassword = await bcrypt.hash(appusers.password, salt);
		} catch (bcryptError) {
			console.error("Error hashing password:", bcryptError.message);
			return res.status(500).json({
				success: false,
				message: "Error hashing password. Please try again.",
			});
		}

		// remplacer password par sa version hachée
		appusers.password = hashedPassword;

		// création new appuser avec rôle par défaut
		const newAppUser = new AppUser({
			...appusers,
			password: hashedPassword,
			role: defaultRole._id,
		});

		//

		console.log("Saving new AppUser to database...");
		await newAppUser.save();
		res.status(201).json({
			success: true,
			message: "AppUser created successfully.",
			data: newAppUser,
		});
	} catch (error) {
		console.error("Error in Create AppUser:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const putAppUser = async (req, res) => {
	const { id } = req.params;
	const appusers = req.body;

	// vérif validité ID
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid AppUser Id" });
	}

	// Validation des champs à mettre à jour (par exemple, l'email ne doit pas être dupliqué)
	try {
		const existingAppUser = await AppUser.findOne({ email: appusers.email });
		if (existingAppUser && existingAppUser._id.toString() !== id) {
			return res.status(400).json({
				success: false,
				message: "This email is already taken by another user.",
			});
		}

		// Mise à jour de l'AppUser
		const updatedAppUser = await AppUser.findByIdAndUpdate(
			id,
			{
				$set: {
					...appusers,
				},
			},
			{
				new: true, // retourne l'objet mis à jour
				runValidators: true, // valide les changements selon les règles du modèle
			}
		);

		// id appuser non trouvé
		if (!updatedAppUser) {
			return res
				.status(404)
				.json({ success: false, message: "AppUser not found" });
		}

		res.status(200).json({
			success: true,
			message: "AppUser successfully updated.",
			data: updatedAppUser.toObject({
				versionKey: false,
				transform: (doc, ret) => {
					delete ret.password; // ici on retire le password avant de le renvoyer, sécurité
					return ret;
				},
			}),
		});
	} catch (error) {
		console.error("Error in updating AppUser:", error.message);
		return res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteAppUser = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res
			.status(404)
			.json({ success: false, message: "Invalid AppUser Id" });
	}

	try {
		const appusers = await AppUser.findById(id); // TODO: findByIdAndDelete(id) une fois que CORBEILLE implémentée

		// si appuser n'existe pas
		if (!appusers) {
			return res
				.status(404)
				.json({ success: false, message: "AppUser not found" });
		}

		// soft delete - on marque appuser comme suppr, et on marque la date
		appusers.is_deleted = true;
		appusers.deleted_at = new Date();
		// on save les modifs
		await appusers.save();

		res
			.status(200)
			.json({ success: true, message: "AppUser marked as deleted" });
	} catch (error) {
		console.log("Error in deleting AppUser:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};
