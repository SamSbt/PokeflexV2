import mongoose from "mongoose";

const pokeflonSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 50,
		},
		sound: {
			type: String,
			maxlength: 255,
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
		},
		img_src: {
			type: String,
			maxlength: 255,
		},
		is_deleted: {
			type: Boolean,
			default: false, // par défaut, un pokeflon n'est pas supprimé
		},
		visibility: {
			type: Boolean,
			default: true, // par défaut, un pokeflon est visible
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
