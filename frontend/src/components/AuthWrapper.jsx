import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

const AuthWrapper = ({ children }) => {
	const { isLoggedIn, refreshToken, logout } = useAuthStore();

	useEffect(() => {
		const refreshTokenPeriodically = async () => {
			if (isLoggedIn) {
				const success = await refreshToken();
				if (!success) {
					logout();
				}
			}
		};

		refreshTokenPeriodically();
		const intervalId = setInterval(refreshTokenPeriodically, 14 * 60 * 1000);

		return () => clearInterval(intervalId);
	}, [isLoggedIn, refreshToken, logout]);

	return <>{children}</>;
};

export default AuthWrapper;
