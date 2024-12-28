import { create } from "zustand";

export const useAuthStore = create((set) => ({
	isLoggedIn: false,
	userRole: null,
	username: null,
	loading: false,
	accessToken: null,
	setLoginStatus: (status) => set({ isLoggedIn: status }),
	setUserRole: (userRole) => {
		console.log("Setting userRole to:", userRole);
		set({ userRole });
	},
	setUsername: (username) => {
		set({ username }); // Update the state of username
	},
	setLoading: (loading) => set({ loading }),

	// Login method
	login: async (credentials) => {
		try {
			set({ loading: true });
			const response = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(credentials),
			});

			const data = await response.json();
			if (response.ok) {
				console.log("useauthstore response :", response);
				set({
					accessToken: data.data.accessToken,
					isLoggedIn: true,
					userRole: data.data.user.role,
					username: data.data.user.username,
				});
				return { success: true, data: data.data };
			} else {
				return { success: false, message: data.message };
			}
		} catch (error) {
			console.error("Login error:", error);
			return { success: false, message: error.message };
		}
	},

	// Refresh access token method
	refreshAccessToken: async () => {
		const response = await fetch("http://localhost:5000/api/auth/refresh", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to refresh access token");
		}

		const data = await response.json();

		set({
			accessToken: data.accessToken,
		});

		return data.accessToken;
	},

	fetchWithAccessToken: async (url, options = {}) => {
		const { accessToken, refreshAccessToken } = useAuthStore.getState(); // Accéder au state actuel
		let retry = true; // Flag pour contrôler le rafraîchissement du token
		//console.log("⭐ Current Access Token:", accessToken);

		// Préparer les options de la requête avec le token actuel
		const currentOptions = {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${accessToken}`,
			},
			credentials: "include", // Inclure les cookies si nécessaire
		};

		try {
			// Effectuer la requête initiale
			let response = await fetch(url, currentOptions);

			// Si le token est expiré (401), tenter de le rafraîchir
			if (response.status === 401 && retry) {
				retry = false; // Empêche une boucle infinie
				console.warn("⚠️ Token expiré. Tentative de rafraîchissement...");

				// Rafraîchir le token
				const newAccessToken = await refreshAccessToken();

				if (newAccessToken) {
					console.log(
						"✅ Token rafraîchi avec succès. Nouvelle tentative de requête..."
					);
					// Mettre à jour les headers avec le nouveau token
					currentOptions.headers.Authorization = `Bearer ${newAccessToken}`;

					// Réessayer la requête avec le nouveau token
					response = await fetch(url, currentOptions);
				} else {
					console.error("❌ Échec du rafraîchissement du token.");
					throw new Error("Unable to refresh access token");
				}
			}

			return response; // Retourne la réponse (peut être la requête initiale ou réessayée)
		} catch (error) {
			console.error("Erreur avec fetchWithAccessToken:", error);
			throw error; // Propager l'erreur pour permettre un traitement global
		}
	},

	// Logout method
	logout: () => {
		set({ isLoggedIn: false, userRole: null, username: "" });
	},

}));
