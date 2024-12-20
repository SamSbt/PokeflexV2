import { create } from "zustand";
import { setCookie, getCookie } from "../utils/cookieUtils.js";

export const useAuthStore = create((set) => ({
	isLoggedIn: false,
	userRole: null,
	username: getCookie("username") || "",
	setLoginStatus: (status) => set({ isLoggedIn: status }),
	setUserRole: (role) => {
		console.log("Setting userRole to:", role);
		set({ userRole: role.role_name });
	},
	setUsername: (username) => {
		setCookie("username", username, 7); // Save username in a cookie with 7 days expiry
		console.log("Setting username to:", username);
		set({ username }); // Update the state of username
	},

	// Login method
	login: async (credentials) => {
		try {
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
					userRole: data.data.user.role.role_name,
					username: data.data.user.username,
				});
			} else {
				throw new Error(data.message);
			}
		} catch (error) {
			throw error;
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
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
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
