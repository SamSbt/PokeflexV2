import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
	persist(
		//middleware pour persister les données dans le localStorage
		(set, get) => ({
			isLoggedIn: false,
			userRole: null,
			username: null,
			loading: false,
			accessToken: null,
			roles: [],
			contacts: [],
			setLoginStatus: (status) => set({ isLoggedIn: status }),
			setUserRole: (userRole) => {
				console.log("Setting userRole to:", userRole);
				set({ userRole });
			},
			setUsername: (username) => {
				set({ username });
			},
			setLoading: (loading) => set({ loading }),
			getAccessToken: () => {
				const token = get().accessToken;
				console.log("Access token retrieved:", token);
				return token;
			},

			// login method
			login: async (credentials) => {
				try {
					set({ loading: true });
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/auth/login`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							credentials: "include",
							body: JSON.stringify(credentials),
						}
					);

					const data = await response.json();
					if (response.ok) {
						// console.log("authstore response :", response);
						set({
							accessToken: data.data.accessToken,
							isLoggedIn: true,
							userRole: data.data.user.role,
							username: data.data.user.username,
						});
						return { success: true, data: data.data };
					} else {
						throw new Error(data.message || "Login failed");
					}
				} catch (error) {
					console.error("Login error:", error);
					return { success: false, message: error.message };
				} finally {
					set({ loading: false });
				}
			},

			// Refresh token method
			refreshToken: async () => {
				console.log("Attempting to refresh token");
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/auth/refresh`,
						{
							method: "POST",
							credentials: "include",
						}
					);
					console.log("Refresh token response:", response);

					if (!response.ok) {
						throw new Error("Failed to refresh access token");
					}

					const data = await response.json();
					set({
						accessToken: data.accessToken,
						isLoggedIn: true,
					});
					console.log("Token refreshed successfully", data.accessToken);
					return data.accessToken; // return true ?
				} catch (error) {
					console.error("Error refreshing token:", error);
					set({
						isLoggedIn: false,
						userRole: null,
						username: null,
						accessToken: null,
					});
					return null; // return false; // réinitialise l état en cas d'échec refresh token
				}
			},

			// fetch roles
			fetchRoles: async () => {
				const { getAccessToken, refreshToken } = get();

				const fetchWithToken = async (token) => {
					const response = await fetch(`${import.meta.env.VITE_API_URL}/role`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
						credentials: "include",
					});
					console.log("Fetch response status:", response.status);
					return response;
				};

				try {
					let token = getAccessToken();
					console.log("Fetching roles with token:", token);

					let response = await fetchWithToken(token);

					if (response.status === 401) {
						console.log("Token expired, attempting to refresh...");
						const refreshed = await refreshToken();
						if (refreshed) {
							token = getAccessToken();
							console.log("Refreshed token:", token);
							response = await fetchWithToken(token);
						} else {
							throw new Error("Unable to refresh token");
						}
					}

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data = await response.json();
					console.log("Fetched roles data:", data);
					set({ roles: data });
					return data;
				} catch (error) {
					console.error("Error fetching roles:", error);
					throw error;
				}
			},

			// fetch contact messages
			fetchContacts: async () => {
				const { getAccessToken, refreshToken } = get();

				const fetchWithToken = async (token) => {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/contact`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
							credentials: "include",
						}
					);
					return response;
				};

				try {
					let token = getAccessToken();
					console.log("Fetching contacts with token:", token);

					let response = await fetchWithToken(token);

					if (response.status === 401) {
						console.log("Token expired, attempting to refresh...");
						const refreshed = await refreshToken();
						if (refreshed) {
							token = getAccessToken();
							console.log("Refreshed token:", token);
							response = await fetchWithToken(token);
						} else {
							throw new Error("Unable to refresh token");
						}
					}

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data = await response.json();
					console.log("Fetched contacts data:", data);
					set({ contacts: data.data || [] });
					return data.data || [];
				} catch (error) {
					console.error("Error fetching contacts:", error);
					throw error;
				}
			},

			// logout method
			logout: async () => {
				try {
					//console.log("Attempting to logout...");
					const logoutUrl = `${import.meta.env.VITE_API_URL}/auth/logout`;
					//console.log("Logout URL:", logoutUrl);

					const response = await fetch(logoutUrl, {
						method: "POST",
						credentials: "include",
						headers: {
							"Content-Type": "application/json",
						},
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						throw new Error(
							`Logout failed: ${response.status} ${response.statusText}. ${
								errorData.message || ""
							}`
						);
					}

					const data = await response.json();
					//console.log("Logout response:", data);

					// clear tt ce qui est en localStorage
					localStorage.removeItem("auth-storage");

					// si logout = success, alors on clear
					set({
						isLoggedIn: false,
						userRole: null,
						username: null,
						accessToken: null,
					});

					return { success: true };
				} catch (error) {
					console.error("Logout error:", error);
					return { success: false, message: error.message };
				}
			},

			// méthode générique de fetch - garder pour optimisation future
			fetchWithAccessToken: async (url, options = {}) => {
				const { accessToken, refreshToken } = useAuthStore.getState(); // Accéder au state actuel
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

				//   if (!(options.body instanceof FormData)) {
				//         currentOptions.headers["Content-Type"] = "application/json";
				//     }

				try {
					// Effectuer la requête initiale
					let response = await fetch(url, currentOptions);

					// Si le token est expiré (401), tenter de le rafraîchir
					if (response.status === 401 && retry) {
						retry = false; // Empêche une boucle infinie
						console.warn("⚠️ Token expiré. Tentative de rafraîchissement...");

						// Rafraîchir le token
						const newAccessToken = await refreshToken();

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
		}),
		{
			name: "auth-storage",
			getStorage: () => localStorage,
		}
	)
);