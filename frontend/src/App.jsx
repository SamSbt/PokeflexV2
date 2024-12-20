import Routing from "./Routes";
import { Container } from "react-bootstrap";
import { useAuthStore } from "../src/store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppNavbar from "./components/app-navbar/AppNavbar";
import AppHeader from "./components/app-header/AppHeader";
import AppFooter from "./components/app-footer/AppFooter";

function App() {
	const { isLoggedIn, userRole } = useAuthStore();
	const navigate = useNavigate();
	const location = useLocation();

useEffect(() => {
	if (isLoggedIn && location.pathname === "/login") {
		if (userRole === "Admin") {
			navigate("/dashboard"); // Redirige l'admin vers le dashboard
		} else if (userRole === "Dresseur") {
			navigate("/"); // Redirige le dresseur vers la page d'accueil
		}
	}
}, [isLoggedIn, userRole, location.pathname, navigate]);

	return (
		<>
			<Container fluid>
				<div className="wrapper">
					<AppNavbar />
					{location.pathname !== "/dashboard" && <AppHeader />}
					<main>
						<Routing />
					</main>
					<AppFooter />
				</div>
			</Container>
		</>
	);
}

export default App;
