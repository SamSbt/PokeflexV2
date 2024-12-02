import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
	{
		role_name: {
			type: String,
			required: true,
			maxlength: 50,
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
