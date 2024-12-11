import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
	{
		is_read: {
			type: Boolean,
			default: false, // par défaut, la notification n'est pas lue
		},
		is_likes: {
			type: Boolean,
			default: false, // par défaut, la notification n'est pas un "like"
		},
		// référence à l'utilisateur
		appuser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AppUser",
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//add un champ virtuel pour "id" basé sur "_id"
notificationSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
