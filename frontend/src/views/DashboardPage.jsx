import React, { useEffect, useState } from "react";
import {
	Button,
	Col,
	Container,
	Row,
	Table,
	Badge,
	Spinner,
	Card,
	Form,
} from "react-bootstrap";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import CustomButton from "../components/custom-button/CustomButton";

const DashboardPage = () => {
	const { userRole, fetchRoles, fetchContacts, loading, setLoading } =
		useAuthStore();
	const [error, setError] = useState("");
	const [localRoles, setLocalRoles] = useState([]);
	const [localContacts, setLocalContacts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (userRole !== "Admin") {
			navigate("/");
		} else {
			loadData();
		}
	}, [userRole, navigate]);

	const loadData = async () => {
		try {
			setLoading(true);
			const [rolesData, contactsData] = await Promise.all([
				fetchRoles(),
				fetchContacts(),
			]);
			setLocalRoles(rolesData.data || []);
			setLocalContacts(
				contactsData.map((contact) => ({ ...contact, isRead: false })) || []
			);
		} catch (error) {
			console.error("Error loading data:", error);
			setError("Erreur lors de la récupération des données");
			if (error.message === "Unable to refresh token") {
				navigate("/login");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCreateRole = () => {
		// Implement create role logic
		console.log("Create new role");
	};

	const handleModifyRole = (roleId) => {
		// Implement modify role logic
		console.log("Modify role:", roleId);
	};

	const handleDeleteRole = (roleId) => {
		// Implement delete role logic
		console.log("Delete role:", roleId);
	};

	const handleToggleRead = (contactId) => {
		setLocalContacts((prevContacts) =>
			prevContacts.map((contact) =>
				contact._id === contactId
					? { ...contact, isRead: !contact.isRead }
					: contact
			)
		);
	};

	return (
		<section className="dashboard">
			<Container className="mt-5">
				<Row className="justify-content-center mb-4">
					<Col xs="auto" className="text-center">
						<h2 className="mb-4">Tableau de bord de l'Admin</h2>
					</Col>
				</Row>
				{error && <p className="text-danger">{error}</p>}
				{loading ? (
					<div className="text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Chargement...</span>
						</Spinner>
					</div>
				) : (
					<>
						<Row className="mb-5">
							<Col>
								<Card className="bg-dark text-light">
									<Card.Header
										as="h5"
										className="d-flex justify-content-between align-items-center"
									>
										<span>Rôles</span>
										<CustomButton
											text="Nouveau rôle"
											variant="success"
											size="sm"
											onClick={handleCreateRole}
											className="btn-red"
										>
											<FaPlus /> Nouveau rôle
										</CustomButton>
									</Card.Header>
									<Card.Body>
										<Table bordered hover responsive className="table-dark">
											<thead>
												<tr>
													<th>Nom du rôle</th>
													<th>État</th>
													<th>Actions</th>
												</tr>
											</thead>
											<tbody>
												{localRoles.length > 0 ? (
													localRoles.map((role) => (
														<tr key={role._id}>
															<td>{role.role_name}</td>
															<td>
																<Badge
																	bg={role.is_deleted ? "danger" : "success"}
																>
																	{role.is_deleted ? "Supprimé" : "Actif"}
																</Badge>
															</td>
															<td>
																<CustomButton
																	text="Modifier"
																	variant="primary"
																	size="sm"
																	className="me-2 btn-red"
																	onClick={() => handleModifyRole(role._id)}
																>
																	<FaEdit /> Modifier
																</CustomButton>
																<CustomButton
																	text="Supprimer"
																	variant="danger"
																	size="sm"
																	className="btn-black"
																	onClick={() => handleDeleteRole(role._id)}
																>
																	<FaTrash /> Supprimer
																</CustomButton>
															</td>
														</tr>
													))
												) : (
													<tr>
														<td colSpan={3}>Aucun rôle trouvé.</td>
													</tr>
												)}
											</tbody>
										</Table>
									</Card.Body>
								</Card>
							</Col>
						</Row>
						<Row>
							<Col>
								<Card className="bg-dark text-light">
									<Card.Header as="h5">Messages de contact</Card.Header>
									<Card.Body>
										<Table
											bordered
											hover
											responsive
											className="table-dark contact-messages-table"
										>
											<thead>
												<tr>
													<th>Email</th>
													<th>Objet</th>
													<th>Message</th>
													<th>Date</th>
													<th>État</th>
												</tr>
											</thead>
											<tbody>
												{localContacts.length > 0 ? (
													localContacts.map((message) => (
														<tr
															key={message._id}
															className={message.isRead ? "" : "unread"}
														>
															<td>{message.email}</td>
															<td>{message.subject}</td>
															<td>{message.message}</td>
															<td>
																{new Date(message.createdAt).toLocaleString()}
															</td>
															<td>
																<div className="d-flex flex-column align-items-center">
																	<Form.Check
																		type="switch"
																		id={`read-switch-${message._id}`}
																		checked={message.isRead}
																		onChange={() =>
																			handleToggleRead(message._id)
																		}
																		label=""
																	/>
																	<span className="mt-1">
																		{message.isRead ? "Lu" : "À lire"}
																	</span>
																</div>
															</td>
														</tr>
													))
												) : (
													<tr>
														<td colSpan={5}>Aucun message trouvé.</td>
													</tr>
												)}
											</tbody>
										</Table>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</>
				)}
			</Container>
		</section>
	);
};

export default DashboardPage;
