import { Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import CustomButton from "../components/custom-button/CustomButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ProfilUserPage = () => {
	const [showPassword, setShowPassword] = useState(false);

	// fonctions des boutons
	const handleEdit = () => {
		console.log("Vous voulez modifier votre mail ?");
	};

	const handleDelete = () => {
		console.log("Vous voulez supprimer votre compte ?");
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<>
			<section>
				<div className="d-flex justify-content-center">
					<Row className="justify-content-center rounded-2 bg-dark my-3 p-2 size-row-userProfile">
						<Form className="p-3 sizeFormUserProfile" method="" noValidate>
							<Form.Group className="mb-3" controlId="inputPseudo">
								<Form.Label>Nom d'utilisateur :</Form.Label>
								<Form.Control
									type="text"
									name="username"
									placeholder="User123"
									autoComplete="username"
									disabled
								/>
							</Form.Group>

							<Row className="mb-3">
								<Form.Group as={Col} sm={10} controlId="inputEmail">
									<Form.Label>Adresse Email :</Form.Label>
									<Form.Control
										type="email"
										name="email"
										placeholder="n**@exemple.com"
										autoComplete="email"
										disabled
									/>
								</Form.Group>
								<Col
									sm={2}
									className="d-flex justify-content-center align-items-end"
								>
									<p className="underline" onClick={handleEdit}>
										Modifier
									</p>
								</Col>
							</Row>

							<Row className="mb-3">
								<Form.Group as={Col} sm={10} controlId="inputPassword">
									<Form.Label>Mot de passe :</Form.Label>
									<div className="position-relative">
										<Form.Control
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="*********"
											disabled
										/>
										<span
											className="position-absolute top-50 end-0 translate-middle-y me-3 text-black"
											style={{ cursor: "pointer" }}
											onClick={togglePasswordVisibility}
										>
											{showPassword ? <FaEyeSlash /> : <FaEye />}
										</span>
									</div>
								</Form.Group>
								<Col
									sm={2}
									className="d-flex justify-content-center align-items-end"
								>
									<p className="underline" onClick={handleEdit}>
										Modifier
									</p>
								</Col>
							</Row>

							<div className="text-center my-4">
								<Link to="/login/:id/favorites">
									<CustomButton
										text="Voir mes PokeFlon favoris"
										className="btn-black btn-fav"
									/>
								</Link>
							</div>
							{/* <p className="small-text text-white-50">
								Profil créé le xx/xx/xx. Mis à jour le xx/xx/xx.
							</p> */}

							<div className="text-center mt-3">
								<CustomButton
									text="Supprimer"
									className="btn-red"
									onClick={handleDelete}
								/>
							</div>
						</Form>
					</Row>
				</div>
			</section>
		</>
	);
};

export default ProfilUserPage;
