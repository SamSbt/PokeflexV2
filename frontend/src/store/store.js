import { create } from "zustand";
import { getCookie } from "../utils/cookieUtils";
import { useAuthStore } from "../store/authStore";

export const usePokeflonStore = create((set) => {
	const fetchProtectedResource = useAuthStore.getState().fetchProtectedResource;

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
				const data = await fetchProtectedResource(
					"http://localhost:5000/api/pokeflon"
				);
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
				const data = await fetchProtectedResource(
					`http://localhost:5000/api/pokeflon/${id}`
				);
				if (data.success) {
					set({ loadingPokeflonsById: false });
					return data.data; // Renvoie le Pokéflon spécifique
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
				// const data = await fetchProtectedResource(
				// 	`http://localhost:5000/api/pokeflon/by-type/${id}`
				// );

				const response = await fetch(
					`http://localhost:5000/api/pokeflon/by-type/${id}`
				); // Point d'API pour récupérer les Pokéflons par type
				const data = await response.json();

				//console.log("data PokeflonsByIdType", data.data);
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

		// Fonction pour récupérer les rôles
		fetchRoles: async () => {
			set({ error: null });
			try {
				// récupérer le token depuis le cookie
				const token = getCookie("authToken");

				if (!token) {
					set({ error: "Utilisateur non authentifié" });
					return;
				}
				const data = await fetchProtectedResource(
					"http://localhost:5000/api/admin/role"
				);

				if (data.success) {
					set({ roles: data.data }); // Mise à jour du store avec les rôles récupérés
				} else {
					set({ error: data.message || "Échec de la récupération des rôles" });
					//console.error("Échec de la récupération des rôles :", data.message);
				}
			} catch (error) {
				set({ error: error.message });
				//console.error("Erreur lors de la récupération des rôles :", error);
			}
		},
	};
});
