import mongoose from "mongoose";

const pokeflonAppUserSchema = new mongoose.Schema(
	{
		pokeflon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pokeflon", // référence à la collection 'pokeflons'
			required: true,
		},
		appuser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AppUser", // référence à la collection 'appusers'
			required: true,
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

// pour spécifier le nom de la collection explicitement :
pokeflonAppUserSchema.set("collection", "pokeflonappusers");

const PokeflonAppUser = mongoose.model(
	"PokeflonAppUser",
	pokeflonAppUserSchema
);

export default PokeflonAppUser;
