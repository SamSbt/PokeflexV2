import mongoose from "mongoose";

const typePokeflonSchema = new mongoose.Schema(
	{
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Type", // référence à la collection 'types'
			required: true,
		},
		pokeflon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pokeflon", // référence à la collection 'pokeflons'
			required: true,
		},
	},
	{
		timestamps: true, // ajoute automatiquement createdAt et updatedAt
	}
);

// pour spécifier le nom de la collection explicitement :
typePokeflonSchema.set("collection", "typepokeflons");

const TypePokeflon = mongoose.model("TypePokeflon", typePokeflonSchema);

export default TypePokeflon;
