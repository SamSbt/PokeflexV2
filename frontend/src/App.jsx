import Routing from "./Routes";
import { Container } from "react-bootstrap";
import AppNavbar from "./components/app-navbar/AppNavbar";



function App() {
	return (
		<>
			<Container fluid className="g-0">
				<div className="wrapper">
					<AppNavbar />
					{/* <AppHeader /> */}
					<main>
						<Routing />
					</main>
					{/* <AppFooter /> */}
				</div>
			</Container>
		</>
	);
}

export default App;