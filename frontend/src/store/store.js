import { create } from "zustand";

export const useStore = create((set) => ({
	isLoggedIn: false,
	setLoginStatus: (status) => set({ isLoggedIn: status }),
}));

export const usePokeflonStore = create((set) => ({
	pokeflons: [],
	types: [],
	selectedType: null,
	error: null,
	loadingPokeflons: false,
	loadingPokeflonsByType: false,
	fetchPokeflons: async () => {
		set({ loadingPokeflons: true });
		try {
			const response = await fetch("http://localhost:5000/api/pokeflon");
			const data = await response.json();
			if (data.success) {
				set({ pokeflons: data.data, loadingPokeflons: false });
			} else {
				set({ error: "Failed to fetch Pokeflons", loadingPokeflons: false });
			}
		} catch (error) {
			set({ error: error.message, loadingPokeflons: false });
		}
	},
	fetchPokeflonById: async (id) => {
		try {
			const response = await fetch(`http://localhost:5000/api/pokeflon/${id}`);
			const data = await response.json();
			if (data.success) {
				set({ loadingPokeflonsByType: false });
				return data.data; // Renvoie le Pokéflon spécifique
			} else {
				set({
					error: "Failed to fetch Pokeflon"
				});
				return null;
			}
		} catch (error) {
			set({ error: error.message });
			return null;
		}
	},

	// Fonction pour récupérer les Pokéflons selon le type sélectionné
	fetchPokeflonsByIdType: async (id) => {
		set({ loadingPokeflonsByType: true });
		try {
			const response = await fetch(
				`http://localhost:5000/api/pokeflon/by-type/${id}`
			); // Point d'API pour récupérer les Pokéflons par type
			const data = await response.json();
			//console.log(data.data);
			set({ pokeflons: data.data, loadingPokeflonsByType: false });
		} catch (err) {
			set({
				error: "Failed to fetch Pokéflons",
				loadingPokeflonsByType: false,
			});
		}
	},

	// Sélectionner un type
	setSelectedType: (typeId) => {
		set({ selectedType: typeId });
		// Appelle la fonction pour récupérer les Pokéflons en fonction du type sélectionné
		set().fetchPokeflonsByIdType(typeId);
	},
}));
