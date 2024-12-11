import mongoose from "mongoose";

const typePokeflonSchema = new mongoose.Schema(
	{
		id_type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Type", // référence à la collection 'types'
			required: true,
		},
		id_pokeflon: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Pokeflon", // référence à la collection 'pokeflons'
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//add un champ virtuel pour "id" basé sur "_id"
typePokeflonSchema.virtual("id").get(function() {
	return this._id.toHexString();
});



// pour spécifier le nom de la collection explicitement :
typePokeflonSchema.set("collection", "type_pokeflon");

const TypePokeflon = mongoose.model("TypePokeflon", typePokeflonSchema);

export default TypePokeflon;
