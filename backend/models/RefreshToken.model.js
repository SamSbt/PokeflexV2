import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
	token: { type: String, required: true },
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "AppUser",
		required: true,
	},
	createdAt: { type: Date, default: Date.now, expires: 604800 }, // Expire après 7 jours (7*24*60*60s)
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;
