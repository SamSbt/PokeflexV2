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
					console.log("API URL:", import.meta.env.VITE_API_URL);
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
						console.log("authstore response :", response);
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
				} finally {
					set({ loading: false });
				}
			},

			// Refresh access token method
			refreshToken: async () => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/auth/refresh`,
						{
							method: "POST",
							credentials: "include",
							headers: {
								"Content-Type": "application/json",
							},
						}
					);

					if (!response.ok) {
						throw new Error("Failed to refresh access token");
					}

					const data = await response.json();

					set({
						accessToken: data.accessToken,
						isLoggedIn: true,
					});
					return true;
				} catch (error) {
					console.error("Error refreshing token:", error);
					set({
						isLoggedIn: false,
						userRole: null,
						username: null,
						accessToken: null,
					});
					return null;
				}
			},

			fetchWithAccessToken: async (url, options = {}) => {
				// const { accessToken, refreshAccessToken } = useAuthStore.getState();
				// simplification :
				const state = get();
				let retry = true;

				// Préparer les options de la requête avec le token actuel
				const currentOptions = {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: "include",
				};

				if (!(options.body instanceof FormData)) {
					currentOptions.headers["Content-Type"] = "application/json";
				}

				try {
					let response = await fetch(url, currentOptions);

					// si token expired (401), try refresh
					if (response.status === 401 && retry) {
						retry = false; // Empêche une boucle infinie
						console.warn("⚠️ Token expiré. Tentative de rafraîchissement...");

						// refreh token
						const newAccessToken = await state.refreshAccessToken();

						if (newAccessToken) {
							console.log(
								"✅ Token rafraîchi avec succès. Nouvelle tentative de requête..."
							);
							// maj headers avec nouveau token
							currentOptions.headers.Authorization = `Bearer ${newAccessToken}`;

							// réessayer requête avec nouveau token
							response = await fetch(url, currentOptions);
						} else {
							console.error("❌ Échec du rafraîchissement du token.");
							throw new Error("Unable to refresh access token");
						}
					}

					return response;
				} catch (error) {
					console.error("Erreur avec fetchWithAccessToken:", error);
					throw error;
				}
			},

			// Logout method
			logout: async () => {
				try {
					console.log("Attempting to logout...");
					const logoutUrl = `${import.meta.env.VITE_API_URL}/auth/logout`;
					console.log("Logout URL:", logoutUrl);

					const response = await fetch(logoutUrl, {
						method: "POST",
						credentials: "include",
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
					console.log("Logout response:", data);
					
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
		}),
		{
			name: "auth-storage",
			getStorage: () => localStorage,
		}
	)
);
