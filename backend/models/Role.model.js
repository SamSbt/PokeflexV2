import mongoose from "mongoose";

import uniqueValidator from "mongoose-unique-validator";

const roleSchema = new mongoose.Schema(
	{
		role_name: {
			type: String,
			required: [true, "Role name is required"],
			trim: true, // suppr espaces avant et après
			minlength: [3, "Role name must be at least 3 characters"],
			maxlength: [50, "Role name cannot exceed 50 characters"],
			unique: true,
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
roleSchema.plugin(uniqueValidator);

const Role = mongoose.model("Role", roleSchema);

export default Role;
