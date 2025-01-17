import React from "react";
import { Route, Routes } from "react-router-dom";
import CheckRoles from "./CheckRoles";
import HomePage from "../views/HomePage";
import TypesPage from "../views/TypesPage";
import CreatePage from "../views/CreatePage";
import PokeflonPage from "../views/PokeflonPage";
import RegisterPage from "../views/RegisterPage";
import LoginPage from "../views/LoginPage";
import ProfilUserPage from "../views/ProfilUserPage";
import DashboardPage from "../views/DashboardPage";
import NotFoundPage from "../components/NotFoundPage";

const AppRoutes = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/types" element={<TypesPage />} />
				<Route path="/pokeflon/:id" element={<PokeflonPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				{/*<Route path="/login/:id/favorites" element /> */}

				<Route element={<CheckRoles allowedRoles={["Dresseur", "Admin"]} />}>
					<Route path="/create" element={<CreatePage />} />
					<Route path="/create/:id" element={<CreatePage />} />
					<Route path="/login/:id" element={<ProfilUserPage />} />
				</Route>

				<Route element={<CheckRoles allowedRoles={["Admin"]} />}>
					<Route path="/dashboard" element={<DashboardPage />} />
				</Route>

				{/* route 404 à la fin pour capturer toutes les autres routes non définies */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
};

export default AppRoutes;
