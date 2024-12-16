import Routing from "./Routes";
import { Container } from "react-bootstrap";
import { useStore } from "./store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppNavbar from "./components/app-navbar/AppNavbar";
import AppHeader from "./components/app-header/AppHeader";
import AppFooter from "./components/app-footer/AppFooter";

function App() {
	const { isLoggedIn, userRole } = useStore();
	const navigate = useNavigate();
	const location = useLocation();

	// Cette variable permet de savoir si on a déjà redirigé l'admin.
	const hasRedirected = localStorage.getItem("hasRedirected");

	useEffect(() => {
		// Si l'utilisateur est connecté
		if (isLoggedIn) {
			// Vérifie si l'utilisateur a déjà été redirigé
			if (!hasRedirected) {
				// Si l'utilisateur est admin et qu'il n'a pas encore été redirigé
				if (userRole === "Admin") {
					// Marquer que l'admin a été redirigé
					localStorage.setItem("hasRedirected", "admin");
					// Rediriger l'admin vers le dashboard
					navigate("/dashboard");
				}
				// Si l'utilisateur est un dresseur, redirige vers la page d'accueil
				else if (userRole === "Dresseur") {
					localStorage.setItem("hasRedirected", "dresseur");
					navigate("/");
				}
			}
		}
	}, [isLoggedIn, userRole, navigate, hasRedirected]);

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
