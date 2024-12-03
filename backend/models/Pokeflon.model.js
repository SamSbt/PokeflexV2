import mongoose from "mongoose";

const pokeflonSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: [2, "Name must be at least 2 characters long"],
			maxlength: [25, "Name cannot exceed 25 characters"],
		},
		sound: {
			type: String,
			required: true,
			minlength: [2, "Name must be at least 2 characters long"],
			maxlength: [25, "Name cannot exceed 25 characters"],
		},
		height: {
			type: Number,
			required: true,
		},
		weight: {
			type: Number,
			required: true,
		},
		summary: {
			type: String,
			required: true,
			minlength: [5, "Name must be at least 5 characters long"],
		},
		img_src: {
			type: String,
			required: true,
			maxlength: [255, "Image source cannot exceed 255 characters"],
		},
		is_deleted: {
			type: Boolean,
			default: false, // par défaut, un pokeflon n'est pas supprimé
		},
		deleted_at: {
			type: Date,
			default: null, // Si non supprimé, pas de date associée
		},
		visibility: {
			type: Boolean,
			default: false, // par défaut, un pokeflon n'est pas visible
		},
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AppUser", // l'utilisateur qui a créé le Pokéflon
		},
		// références aux notifications
		notifications: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Notification",
			},
		],
		// référence à l'utilisateur qui a créé ce pokeflon
		appuser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AppUser",
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

const Pokeflon = mongoose.model("Pokeflon", pokeflonSchema);

export default Pokeflon;
