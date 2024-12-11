import { create } from "zustand";

export const useStore = create((set) => ({
	isLoggedIn: false,
	setLoginStatus: (status) => set({ isLoggedIn: status }),
}));

export const usePokeflonStore = create((set) => ({
	pokeflons: [],
	types: [],
	selectedType: null,
	isLoading: false,
	error: null,
	fetchPokeflons: async () => {
		set({ isLoading: true }); // On commence à charger les données
		try {
			const response = await fetch("http://localhost:5000/api/pokeflon");
			const data = await response.json();
			if (data.success) {
				set({ pokeflons: data.data, isLoading: false });
			} else {
				set({ error: "Failed to fetch Pokeflons", isLoading: false });
			}
		} catch (error) {
			set({ error: error.message, isLoading: false });
		}
	},
	fetchPokeflonById: async (id) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`http://localhost:5000/api/pokeflon/${id}`);
			const data = await response.json();
			if (data.success) {
				set({ isLoading: false });
				return data.data; // Renvoie le Pokéflon spécifique
			} else {
				set({ error: "Failed to fetch Pokeflon", isLoading: false });
				return null;
			}
		} catch (error) {
			set({ error: error.message, isLoading: false });
			return null;
		}
	},

	// Fonction pour récupérer les Pokéflons selon le type sélectionné
	fetchPokeflonsByType: async (id) => {
		set({ isLoading: true });
		try {
			const response = await fetch(
				`http://localhost:5000/api/pokeflon/${id}`
			); // Point d'API pour récupérer les Pokéflons par type
			const data = await response.json();
			set({ pokeflons: data, isLoading: false });
		} catch (err) {
			set({ error: "Failed to fetch Pokéflons", isLoading: false });
		}
	},

	// Sélectionner un type
	setSelectedType: (typeId) => {
		set({ selectedType: typeId });
		// Appelle la fonction pour récupérer les Pokéflons en fonction du type sélectionné
		set().fetchPokeflonsByType(typeId);
	},
}));
