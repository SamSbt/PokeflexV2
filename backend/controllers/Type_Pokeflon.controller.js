import Pokeflon from "../models/Pokeflon.model";
import TypePokeflon from "../models/Type_Pokeflon.model";

const getPokeflonsWithTypes = async (req, res) => {
	try {
		const pokeflons = await Pokeflon.find()
			.populate({
				path: "types", // Assurez-vous que vous avez un champ "types" dans votre modèle Pokeflon
				select: "type_name", // Sélectionne seulement le nom du type pour l'affichage
			})
			.exec();

		res.json(pokeflons);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching Pokéflons with types", error: err });
	}
};
