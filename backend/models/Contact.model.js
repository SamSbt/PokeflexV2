import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			maxlength: 255,
		},
		email: {
			type: String,
			required: true,
			maxlength: 255,
		},
		message: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
