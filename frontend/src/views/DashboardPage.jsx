import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table} from "react-bootstrap";
//import { usePokeflonStore } from "../store/store";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
// import { fetchWithAccessToken } from "../utils/fetchWithAccesToken";

const DashboardPage = () => {
	const { accessToken , fetchWithAccessToken} = useAuthStore();
	const { userRole } = useAuthStore();
	//console.log("DashboardPage rendered", userRole);
	const [data, setData] = useState();
	const [error, setError] = useState("");

	const getData = async () => {
		try {
			const response = await fetchWithAccessToken("http://localhost:5000/api/role");
			// const response = await fetchWithAccessToken("http://localhost:5000/api/role");
			if (!response.ok) {
			setError("Erreur lors de la récupération des données");
			}
			const data = await response.json();
			setData(data);
			console.log("Data fetched successfully", data);
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Erreur lors de la récupération des données");
		}
	};

	//  // Appel de la fonction pour récupérer les données du tableau
	// 	const [error, setError] = useState("");
	// 	//const { roles, fetchRoles } = usePokeflonStore();
	// 	const { isLoggedIn, userRole } = useAuthStore();
	// 	const navigate = useNavigate();

	// 	// useEffect(() => {
	// 	// 	fetchRoles(); // Appel de la méthode pour récupérer les rôles
	// 	// }, [fetchRoles]);

	// 	// if (error) {
	// 	// 	return <Alert variant="danger">{error}</Alert>;
	// 	// }

	// useEffect(() => {
	// 	// Vérifie si l'utilisateur est connecté et a le rôle "Admin"
	// 	if (!isLoggedIn || userRole !== "Admin") {
	// 		navigate("/"); // Redirige vers la page d'accueil s'il n'est pas admin
	// 	}
	// }, [isLoggedIn, userRole, navigate]);

	return (
		<section>
			<Button onClick={getData}>Récupérer les données</Button>
			{error && <p>{error}</p>}
			<Container className="mt-5">
				<Row className="justify-content-center mb-4">
					<Col xs="auto" className="text-center underline">
						<h2>Tableau de bord de l'Admin</h2>
					</Col>
				</Row>
				<Row>
					{/* Tableau pour afficher les rôles */}
					<Col>
						<h4>Rôles</h4>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>Nom du rôle</th>
									<th>Supprimé</th>
								</tr>
							</thead>
							<tbody>
								{/* {roles && roles.length > 0 ? (
									roles.map((role) => (
										<tr key={role.id}>
											<td>{role.role_name}</td>
											<td>{role.is_deleted ? "Oui" : "Non"}</td>
										</tr>
									))
								) : (
									<p>Aucun rôle trouvé.</p> // Optionnel : affiche un message si roles est vide ou non défini
								)} */}
								<tr>
									<td>Les rôles seront ici.</td>
								</tr>
							</tbody>
						</Table>
					</Col>
				</Row>

				{/* <Row> */}
				{/* Tableau pour afficher les types */}
				{/*<Col>
						<h2>Types</h2>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>Nom du type</th>
								</tr>
							</thead>
							<tbody>
								{/* Remplacer "types" par le tableau de types dans le store si tu l'as déjà récupéré */}
				{/* {types.map((type) => (
									<tr key={type.id}>
										<td>{type.name}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</Col> 
				</Row> */}
			</Container>
		</section>
	);
};

export default DashboardPage;
