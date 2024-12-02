import mongoose from "mongoose";

const appUserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			maxlength: 255,
		},
		password: {
			type: String,
			required: true,
			minlength: 8, // par ex, à voir, pour la sécurité
		},
		is_valid: {
			type: Boolean,
			default: false, // l'utilisateur est validé par défaut comme false
		},
		is_online: {
			type: Boolean,
			default: false, // par défaut, l'utilisateur est hors ligne
		},
		is_deleted: {
			type: String,
			maxlength: 50,
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

const AppUser = mongoose.model("AppUser", appUserSchema);

export default AppUser;
