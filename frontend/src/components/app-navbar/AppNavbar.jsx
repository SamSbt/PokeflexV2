import { Dropdown, Form, Image, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePokeflonStore, useStore } from "../../store/store";
import CustomButton from "../custom-button/CustomButton";
import { FaSignOutAlt } from "react-icons/fa";

import "./app-navbar.scss";

const AppNavbar = () => {
	const { isLoggedIn, userRole, setUserRole, setLoginStatus } = useStore();
	const location = useLocation(); // Hook pour obtenir la localisation actuelle
	const { pokeflons, fetchPokeflons } = usePokeflonStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredPokeflons, setFilteredPokeflons] = useState([]);
	//console.log("Valeur de userRole :", userRole);

	const navigate = useNavigate();

	// Récupérer les Pokéflons dès que le composant est monté
	useEffect(() => {
		fetchPokeflons();
	}, [fetchPokeflons]);

	// Fonction pour gérer les changements dans le champ de recherche
	const handleInputChange = (event) => {
		const term = event.target.value;
		setSearchTerm(term);

		// Si la recherche est vide, ne pas afficher de résultats
		if (term.length === 0) {
			setFilteredPokeflons([]);
		} else {
			// Filtrer les Pokéflons qui contiennent la chaîne de recherche
			const filtered = pokeflons.filter((pokeflon) =>
				pokeflon.name.toLowerCase().includes(term.toLowerCase())
			);
			setFilteredPokeflons(filtered);
		}
	};

	const resetSearch = () => {
		setSearchTerm("");
		setFilteredPokeflons([]);
	};

	const handleLogout = () => {
		// Supprimer le token du localStorage
		localStorage.removeItem("authToken");
		localStorage.removeItem("refreshToken");
	

		// Réinitialiser l'état de connexion dans le store
		setLoginStatus(false);
		setUserRole(null);

		// Rediriger vers la page d'accueil après la déconnexion
		navigate("/");
	};

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
						className={`me-2 ${location.pathname === "/types" ? "active" : ""}`}
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
					location.pathname !== "/login/:id" &&
					location.pathname !== "/register" && (
						<Nav>
							<Link to="/login">
								<CustomButton text="Se connecter" className="btn-red me-3" />
							</Link>
						</Nav>
					)}

				{isLoggedIn && userRole === "Dresseur" && (
					<Nav className="d-flex align-items-center">
						<FaSignOutAlt
							onClick={handleLogout}
							className="text-white me-3 cursor-pointer"
							style={{ fontSize: "1.5rem" }} // Taille de l'icône
						/>
					</Nav>
				)}

				{/* btn affiché si connecté(store), ou sur la page account user si admin*/}
				{isLoggedIn && userRole === "Admin" && (
					<Nav className="d-flex align-items-center">
						{/* L'icône de déconnexion est toujours affichée */}
						<FaSignOutAlt
							onClick={handleLogout}
							className="text-white me-3 cursor-pointer"
							style={{ fontSize: "1.5rem" }} // Taille de l'icône
						/>

						{/* Le bouton Dashboard n'est affiché que si on n'est pas déjà sur /dashboard */}
						{location.pathname !== "/dashboard" && (
							<Link to="/dashboard">
								<CustomButton text="Dashboard" className="btn-red me-3" />
							</Link>
						)}
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
						value={searchTerm}
						onChange={handleInputChange}
					/>
					{/* Affichage dynamique des résultats de recherche */}
					{searchTerm && filteredPokeflons.length > 0 && (
						<Dropdown.Menu show className="position-absolute w-100 border-0">
							{filteredPokeflons.map((pokeflon) => (
								<Dropdown.Item
									key={pokeflon.id}
									as={Link}
									to={`/pokeflon/${pokeflon.id}`}
									onClick={resetSearch}
								>
									{pokeflon.name}
								</Dropdown.Item>
							))}
						</Dropdown.Menu>
					)}
					<CustomButton text="Rechercher" className="btn-black" />
				</Form>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default AppNavbar;
