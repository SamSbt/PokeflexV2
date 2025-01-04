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
				set({ username }); // Update the state of username
			},
			setLoading: (loading) => set({ loading }),
			getAccessToken: () => get().accessToken,

			// login method
			login: async (credentials) => {
				try {
					set({ loading: true });
					// console.log("API URL:", import.meta.env.VITE_API_URL);
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
						return { success: false, message: data.message };
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
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL}/auth/refresh`,
						{
							method: "POST",
							credentials: "include",
							// headers: {
							// 	"Content-Type": "application/json",
							// },
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

			// fetch roles
			fetchRoles: async () => {
				const { getAccessToken, refreshToken } = get();
				try {
					let token = getAccessToken();
					console.log("Fetching roles with token:", token);

					let response = await fetch(`${import.meta.env.VITE_API_URL}/role`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
						credentials: "include",
					});

					console.log("Fetch response status:", response.status);

					if (response.status === 401) {
						console.log("Token expired, attempting to refresh...");
						const refreshed = await refreshToken();
						if (refreshed) {
							token = getAccessToken();
							console.log("Refreshed token:", token);
							response = await fetch(`${import.meta.env.VITE_API_URL}/role`, {
								headers: {
									Authorization: `Bearer ${token}`,
								},
								credentials: "include",
							});
							console.log(
								"Fetch response status after refresh:",
								response.status
							);
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
				try {
					let token = getAccessToken();
					let response = await fetch(
						`${import.meta.env.VITE_API_URL}/contact`,
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
							credentials: "include",
						}
					);

					if (response.status === 401) {
						const refreshed = await refreshToken();
						if (refreshed) {
							token = getAccessToken();
							response = await fetch(
								`${import.meta.env.VITE_API_URL}/contact`,
								{
									headers: {
										Authorization: `Bearer ${token}`,
									},
									credentials: "include",
								}
							);
						} else {
							throw new Error("Unable to refresh token");
						}
					}

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data = await response.json();
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
					console.log("Attempting to logout...");
					const logoutUrl = `${import.meta.env.VITE_API_URL}/auth/logout`;
					//console.log("Logout URL:", logoutUrl);

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
		}),
		{
			name: "auth-storage",
			getStorage: () => localStorage,
		}
	)
);
