import Routing from "./Routes";
import { Container } from "react-bootstrap";
import AppNavbar from "./components/app-navbar/AppNavbar";
import AppHeader from "./components/app-header/AppHeader";



function App() {
	return (
		<>
			<Container fluid> 
				<div className="wrapper">
					<AppNavbar />
					<AppHeader />
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