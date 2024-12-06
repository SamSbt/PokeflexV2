import mongoose from "mongoose";

import uniqueValidator from "mongoose-unique-validator";

// id noneed car généré auto par mongoose
// "Schema" permet de créer un schéma de données pour bdd MongoDB
// unique => impossibilité de create avec mm name
const typeSchema = new mongoose.Schema(
	{
		type_name: {
			type: String,
			required: true,
			minlength: [2, "Type name must be at least 2 characters long"],
			maxlength: [25, "type name cannot exceed 25 characters"],
		},
		is_deleted: {
			type: Boolean,
			default: false, // soft delete
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);
typeSchema.plugin(uniqueValidator);

const Type = mongoose.model("Type", typeSchema);

export default Type;
