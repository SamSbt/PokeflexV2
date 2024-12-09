import Pokeflon from "../models/Pokeflon.model";


const getPokeflonsWithTypes = async (req, res) => {
	try {
		const pokeflons = await Pokeflon.find()
			.populate({
				path: "types", 
				select: "type_name", 
			})
			.exec();

		res.json(pokeflons);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching Pokéflons with types", error: err });
	}
};
