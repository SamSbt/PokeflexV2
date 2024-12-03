import mongoose from "mongoose";

const pokeflonAppUserSchema = new mongoose.Schema(
	{
		id_pokeflon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pokeflon", // référence à la collection 'pokeflons'
			required: true,
		},
		id_appuser: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "AppUser", // référence à la collection 'appusers'
			required: true,
		},
	},
);

// pour spécifier le nom de la collection explicitement :
pokeflonAppUserSchema.set("collection", "pokeflon_appuser");

const PokeflonAppUser = mongoose.model(
	"PokeflonAppUser",
	pokeflonAppUserSchema
);

export default PokeflonAppUser;
