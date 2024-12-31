import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const appUserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			minlength: [2, "Username must be at least 2 characters long"],
			maxlength: [25, "Username cannot exceed 25 characters"],
			unique: true,
		},
		email: {
			type: String,
			required: true,
			maxlength: 255,
			unique: true,
			validate: {
				validator: function (v) {
					return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
				},
				message: "Please enter a valid email address",
			},
		},
		password: {
			type: String,
			required: true,
			minlength: 8, // par ex, à voir, pour la sécurité
			validate: {
				validator: function (v) {
					return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(v);
				},
				message:
					"Password must contain 8 characters, and at least one uppercase letter, one lowercase letter, one digit, and one special character",
			},
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
			//required: true,
		},
		is_valid: {
			type: Boolean,
			default: false, // l'utilisateur est validé par défaut comme false
		},
		is_online: {
			type: Boolean,
			default: false, // par défaut, l'utilisateur est hors ligne
		},
		is_deleted: {
			type: Boolean,
			default: false, // par défaut, un user n'est pas hard delete
		},
		deleted_at: {
			type: Date,
			default: null, // Si non supprimé, pas de date associée
		},
		failedAttempts: { type: Number, default: 0 }, // Nombre d'échecs de connexion
		lockUntil: { type: Date, default: null }, // Date jusqu'à laquelle le compte est verrouillé
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
appUserSchema.plugin(uniqueValidator);

// Méthode pour vérifier si l'utilisateur est verrouillé
appUserSchema.methods.isLocked = function () {
	return this.lockUntil && this.lockUntil > Date.now(); // Vérifie si le compte est verrouillé
};

//add un champ virtuel pour "id" basé sur "_id"
appUserSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

const AppUser = mongoose.model("AppUser", appUserSchema);

export default AppUser;
