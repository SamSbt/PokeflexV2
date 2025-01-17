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
			unique: true,
		},
		color: {
			type: String,
			required: true,
		},
		is_deleted: {
			type: Boolean,
			default: false, // soft delete
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

typeSchema.plugin(uniqueValidator);

//add un champ virtuel pour "id" basé sur "_id"
typeSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

const Type = mongoose.model("Type", typeSchema);

export default Type;
