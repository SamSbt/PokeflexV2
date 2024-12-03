import mongoose from "mongoose";

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

const Type = mongoose.model("Type", typeSchema);

export default Type;
