import { Form, Image, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import CustomButton from "../custom-button/CustomButton";

import "./app-navbar.scss";

const AppNavbar = () => {
	const { isLoggedIn } = useStore();
	const location = useLocation(); // Hook pour obtenir la localisation actuelle

	return (
		<Navbar
			expand="lg"
			bg="dark"
			variant="dark"
			data-bs-theme="dark"
			className="px-4"
		>
			<Navbar.Brand
				className="d-flex align-items-center logoAnimation"
				as={Link}
				to="/"
			>
				<Image
					alt="Logo de DevFreak"
					src="/images/dev-freak_logo.png"
					width="40"
					className="d-inline-block align-top"
				/>
				<span className="ms-2 special-elite-regular fs-2">DevFreak</span>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Nav.Link
						as={Link}
						to="/"
						className={`me-2 ${location.pathname === "/" ? "active" : ""}`}
					>
						Accueil
					</Nav.Link>
					<Nav.Link
						as={Link}
						to="/types"
						className={`me-2 ${location.pathname === "/type" ? "active" : ""}`}
					>
						Types
					</Nav.Link>
					<Nav.Link
						as={Link}
						to="/create"
						className={`me-2 ${
							location.pathname === "/create" ? "active" : ""
						}`}
					>
						Création
					</Nav.Link>
				</Nav>


				{/* btn caché si connecté(store), ou sur la LoginPage et la RegisterPage*/}
				{!isLoggedIn &&
					location.pathname !== "/login" &&
					location.pathname !== "/register" && (
						<Nav>
							<Link to="/login">
								<CustomButton text="Se connecter" className="btn-red me-3" />
							</Link>
						</Nav>
					)}

				<Form
					className="d-flex form-search position-relative"
					role="search"
					id="searchForm"
				>
					<input
						className="form-control me-2"
						type="search"
						name="inputsearch"
						placeholder="Rechercher un PokéFlon"
						aria-label="Search"
						// value={searchTerm}
						// onChange={handleInputChange}
					/>
					{/* <Dropdown.Menu show className="position-absolute w-100 border-0">
								{filteredPokemon.length > 0 ? (
									filteredPokemon.map((pokemon) => (
										<Dropdown.Item
											key={pokemon.Id_pokemon}
											href={`/pokemon/${pokemon.Id_pokemon}`}
										>
											{pokemon.name}
										</Dropdown.Item>
									))
								) : noResults ? (
									<Dropdown.Item disabled>Aucun Pokémon trouvé</Dropdown.Item>
								) : null}
							</Dropdown.Menu> */}
					<CustomButton text="Rechercher" className="btn-black" />
				</Form>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default AppNavbar;
