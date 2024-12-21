import Routing from "./Routes";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import AppNavbar from "./components/app-navbar/AppNavbar";
import AppHeader from "./components/app-header/AppHeader";
import AppFooter from "./components/app-footer/AppFooter";

function App() {
	const location = useLocation();

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
