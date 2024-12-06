import { create } from "zustand";

export const useStore = create((set) => ({
	isLoggedIn: false,
	setLoginStatus: (status) => set({ isLoggedIn: status }),
}));

export const usePokeflonStore = create((set) => ({
	pokeflons: [],
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
}));