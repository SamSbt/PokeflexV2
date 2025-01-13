import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
	const { isLoggedIn, refreshToken, logout } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		const refreshTokenPeriodically = async () => {
			if (isLoggedIn) {
				const success = await refreshToken();
				if (!success) {
					logout();
					navigate("/login");
				}
			}
		};

		refreshTokenPeriodically();
		const intervalId = setInterval(refreshTokenPeriodically, 14 * 60 * 1000);

		return () => clearInterval(intervalId);
	}, [isLoggedIn, refreshToken, logout, navigate]);

	return <>{children}</>;
};

export default AuthWrapper;
