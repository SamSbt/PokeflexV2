import React from "react";
import { Route, Routes } from "react-router-dom";

import HomePage from "./views/HomePage";

const Routing = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} />
				{/* <Route path="/types" element={<TypesPage />} />
				<Route path="/create" element={<CreaPage />} />
				<Route path="/pokeflon/:id" element={<PokeFlonPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/login/:id" element={<ProfilUserPage />} />
				<Route path="/login/:id/favorites" element /> */}
			</Routes>
		</>
	);
};

export default Routing;