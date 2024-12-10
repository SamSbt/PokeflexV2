import mongoose from "mongoose";

const pokeflonSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minlength: [2, "Pokeflon name must be at least 2 characters long"],
			maxlength: [25, "Pokeflon name cannot exceed 25 characters"],
		},
		sound: {
			type: String,
			required: true,
			minlength: [2, "Pokeflon sound must be at least 2 characters long"],
			maxlength: [25, "Pokeflon sound cannot exceed 25 characters"],
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
			minlength: [5, "Pokeflon summary must be at least 5 characters long"],
		},
		img_src: {
			type: String,
			//required: true,
		},
		is_deleted: {
			type: Boolean,
			default: false, // par défaut, un pokeflon n'est pas hard delete
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
		types: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Type",
				required: true,
			}, 
		],
		// type: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "Type",
		// 		//
		// 	},
		// ],
		// références aux notifications
		// notifications: [
		// 	{
		// 		type: mongoose.Schema.Types.ObjectId,
		// 		ref: "Notification",
		// 	},
		// ],
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

const Pokeflon = mongoose.model("Pokeflon", pokeflonSchema);

export default Pokeflon;
