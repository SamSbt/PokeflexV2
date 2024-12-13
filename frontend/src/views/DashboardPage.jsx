import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { useStore } from "../store/store";

const DashboardPage = () => {
	const [error, setError] = useState("");
	const { roles, fetchRoles } = useStore();

	useEffect(() => {
		fetchRoles(); // Appel de la méthode pour récupérer les rôles
	}, [fetchRoles]);

	if (error) {
		return <Alert variant="danger">{error}</Alert>;
	}
console.log("roles ?? :" + roles);
	if (!roles.length) {
		return <p>Chargement des rôles...</p>;
	}

	return (
		<section>
			<Container className="dashboard-page">
				<Row>
					{/* Tableau pour afficher les rôles */}
					<Col>
						<h2>Rôles</h2>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>Nom du rôle</th>
									<th>Supprimé</th>
								</tr>
							</thead>
							<tbody>
								{roles && roles.length > 0 ? (
									roles.map((role) => (
										<tr key={role.id}>
											<td>{role.role_name}</td>
											<td>{role.is_deleted ? "Oui" : "Non"}</td>
										</tr>
									))
								) : (
									<p>Aucun rôle trouvé.</p> // Optionnel : affiche un message si roles est vide ou non défini
								)}
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
