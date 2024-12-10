import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./views/HomePage";
import TypesPage from "./views/TypesPage";
import CreatePage from "./views/CreatePage";
import PokeflonPage from "./views/PokeflonPage";
import RegisterPage from "./views/RegisterPage";
import LoginPage from "./views/LoginPage";
import ProfilUserPage from "./views/ProfilUserPage";


const Routing = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/types" element={<TypesPage />} />
				<Route path="/create" element={<CreatePage />} />
				<Route path="/pokeflon/:id" element={<PokeflonPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/login/:id" element={<ProfilUserPage />} />
				{/*<Route path="/login/:id/favorites" element /> */}
			</Routes>
		</>
	);
};

export default Routing;