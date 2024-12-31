import { create } from "zustand";

export const usePokeflonStore = create((set) => {
	return {
		pokeflons: [],
		types: [],
		roles: [],
		selectedType: null,
		error: null,
		loadingPokeflons: false,
		loadingPokeflonsByType: false,

		setLoadingPokeflons: (status) => set({ loadingPokeflons: status }),

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
			} finally {
				set({ loadingPokeflons: false });
			}
		},

		fetchPokeflonById: async (id) => {
			set({ loadingPokeflonsById: true, error: null });
			try {
				const response = await fetch(
					`http://localhost:5000/api/pokeflon/${id}`
				);

				const data = await response.json();
				if (data.success) {
					set({ loadingPokeflonsById: false });
					return data.data; // renvoie le Pokéflon spécifique
				} else {
					set({
						error: "Failed to fetch Pokeflon",
						loadingPokeflonById: false,
					});
					return null;
				}
			} catch (error) {
				set({ error: error.message, loadingPokeflonById: false });
				return null;
			}
		},

		// Fonction pour récupérer les Pokéflons selon le type sélectionné
		fetchPokeflonsByIdType: async (id) => {
			set({ loadingPokeflonsByIdType: true });
			try {
				const response = await fetch(
					`http://localhost:5000/api/pokeflon/by-type/${id}` // Point d'API pour récupérer les Pokéflons par type
				);

				// Si le backend retourne une erreur 404
				if (response.status === 404) {
					console.warn("Aucun Pokéflon trouvé pour ce type.");
					set({ pokeflons: [], loadingPokeflonsByIdType: false });
					return;
				}

				// Gérer une erreur autre que 404
				if (!response.ok) {
					throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
				}

				const data = await response.json();

				//console.log("store.js data:", data);
				//console.log("store.js - data PokeflonsByIdType", data.data);

				set({ pokeflons: data.data, loadingPokeflonsByIdType: false });
			} catch (err) {
				set({
					error: "Failed to fetch Pokéflons",
					loadingPokeflonsByIdType: false,
				});
			} finally {
				set({ loadingPokeflonsByType: false });
			}
		},
		// Sélectionner un type
		setSelectedType: async (typeId) => {
			set({ selectedType: typeId });
			// Appelle la fonction pour récupérer les Pokéflons en fonction du type sélectionné
			//set().fetchPokeflonsByIdType(typeId);
			await usePokeflonStore.getState().fetchPokeflonsByIdType(typeId);
		},
	};
});
