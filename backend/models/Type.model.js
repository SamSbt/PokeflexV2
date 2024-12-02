import mongoose from "mongoose";

const typeSchema = new mongoose.Schema(
	{
		type_name: {
			type: String,
			required: true,
			maxlength: 50,
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

const Type = mongoose.model("Type", typeSchema);

export default Type;
