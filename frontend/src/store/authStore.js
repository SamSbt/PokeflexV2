import { create } from "zustand";
import { setCookie, getCookie, deleteCookie } from "../utils/cookieUtils.js";

export const useAuthStore = create((set) => ({
	isLoggedIn: false,
	userRole: null,
	username: getCookie("username") || "",
	loading: false,
	setLoginStatus: (status) => set({ isLoggedIn: status }),
	setUserRole: (userRole) => {
		//console.log("Setting userRole to:", userRole);
		set({ userRole });
	},
	setUsername: (username) => {
		setCookie("username", username, 7); // Save username in a cookie with 7 days expiry
		//console.log("Setting username to:", username);
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
				body: JSON.stringify(credentials),
			});

			const data = await response.json();
			if (response.ok) {
				setCookie("accessToken", data.accessToken, 1); // 1 day expiry
				setCookie("refreshToken", data.refreshToken, 7); // 7 days expiry
				set({
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
		const refreshToken = getCookie("refreshToken");

		if (!refreshToken) {
			throw new Error("No refresh token available");
		}

		const response = await fetch("http://localhost:5000/api/auth/refresh", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			//body: JSON.stringify({ refreshToken }),
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			throw new Error("Failed to refresh access token");
		}

		const data = await response.json();
		setCookie("accessToken", data.accessToken, 1); // 1 day expiry
		return data.accessToken;
	},

	// Fetch protected resource method
	fetchProtectedResource: async (url, options = {}) => {
		const { userRole } = useAuthStore.getState(); // Récupère le rôle depuis le store

		if (userRole !== "Admin") {
			throw new Error(
				"Access denied: You do not have permission to view this resource."
			);
		}

		let accessToken = getCookie("accessToken");

		try {
			let response = await fetch(url, {
				...options,
				headers: {
					...options.headers,
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (response.status === 401) {
				// Access token expired, refresh it
				accessToken = await useAuthStore.getState().refreshAccessToken();

				// Retry the request with the new access token
				response = await fetch(url, {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${accessToken}`,
					},
				});
			}

			if (!response.ok) {
				throw new Error("Failed to fetch protected resource");
			}

			return await response.json();
		} catch (error) {
			console.error("Failed to fetch protected resource:", error);
			throw error;
		}
	},

	// Logout method
	logout: () => {
		deleteCookie("accessToken");
		deleteCookie("refreshToken");
		set({ isLoggedIn: false, userRole: null, username: "" });
	},
}));
