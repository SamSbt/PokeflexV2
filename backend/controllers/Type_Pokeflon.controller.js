import Pokeflon from "../models/Pokeflon.model";


export const getTypesByPokeflon = async (req, res) => {
	const { typeId } = req.params;

	try {
		const pokeflons = await Pokeflon.find()
			.populate({
				path: "types",
				match: { _id: typeId }, // Filtrer les Pokéflons par type
				select: "type_name",
			})
			.exec();

		res.json(pokeflons);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching Pokéflons by types", error: err });
	}
};

// Associer des types avec un Pokéflon
export const associateTypesWithPokeflon = async (req, res) => {
  const { pokeflonId, types } = req.body;  // types devrait être un tableau d'ID de types

  try {
    const pokeflon = await Pokeflon.findById(pokeflonId);

    if (!pokeflon) {
      return res.status(404).json({ success: false, message: "Pokéflon not found" });
    }

    // Ajout des nouveaux types au Pokéflon
    pokeflon.types = [...pokeflon.types, ...types];  // Lier les types au Pokéflon

    await pokeflon.save();

    res.status(200).json({
      success: true,
      message: `Types successfully associated with Pokéflon ${pokeflonId}`,
      data: pokeflon,
    });
  } catch (err) {
    res.status(500).json({ message: "Error associating types with Pokéflon", error: err });
  }
};

// Mettre à jour les types associés à un Pokéflon
export const updateTypesForPokeflon = async (req, res) => {
  const { pokeflonId } = req.params;
  const { types } = req.body;  // Nouveau tableau d'ID de types à associer

  try {
    const pokeflon = await Pokeflon.findById(pokeflonId);

    if (!pokeflon) {
      return res.status(404).json({ success: false, message: "Pokéflon not found" });
    }

    // Remplacer les types associés avec les nouveaux
    pokeflon.types = types;
    await pokeflon.save();

    res.status(200).json({
      success: true,
      message: `Pokéflon ${pokeflonId} updated with new types`,
      data: pokeflon,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating types for Pokéflon", error: err });
  }
};

// Supprimer des types associés à un Pokéflon
export const deleteTypesFromPokeflon = async (req, res) => {
  const { pokeflonId, typesToDelete } = req.body;  // typesToDelete est un tableau d'ID de types à supprimer

  try {
    const pokeflon = await Pokeflon.findById(pokeflonId);

    if (!pokeflon) {
      return res.status(404).json({ success: false, message: "Pokéflon not found" });
    }

    // Supprimer les types de la liste du Pokéflon
    pokeflon.types = pokeflon.types.filter(type => !typesToDelete.includes(type.toString()));

    await pokeflon.save();

    res.status(200).json({
      success: true,
      message: `Types successfully deleted from Pokéflon ${pokeflonId}`,
      data: pokeflon,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting types from Pokéflon", error: err });
  }
};