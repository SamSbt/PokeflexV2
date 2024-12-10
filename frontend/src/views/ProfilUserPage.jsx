import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomButton from "../components/custom-button/CustomButton";

const ProfilUserPage = () => {
	// fonctions des boutons
	const handleEdit = () => {
		console.log("Vous voulez modifier votre mail ?");
	};

	const handleDelete = () => {
		console.log("Vous voulez supprimer votre compte ?");
	};

	return (
		<>
			<section>
				<div className="d-flex justify-content-center">
					<Row className="justify-content-center rounded-2 bg-dark my-3 p-2 size-row-userProfile">
						<form className="p-3 sizeFormUserProfile" method="" noValidate>
							<div className="mb-3">
								<label htmlFor="inputPseudo" className="form-label">
									Nom d'utilisateur :
								</label>
								<input
									type="text"
									className="form-control"
									id="inputPseudo"
									name="userName"
									placeholder="User123"
									disabled
								/>
							</div>
							<Row className="mb-3">
								<label htmlFor="inputEmail" className="form-label">
									Adresse Email :
								</label>
								<Col sm={10}>
									<input
										type="email"
										className="form-control"
										id="inputEmail"
										name="email"
										placeholder="n**@exemple.com"
										disabled
									/>
								</Col>
								<Col
									sm={2}
									className="d-flex justify-content-center align-items-end"
								>
									<p className="underline">Modifier</p>
								</Col>
							</Row>

							<Row className="mb-3">
								<label htmlFor="inputPassword" className="form-label">
									Mot de passe :
								</label>
								<Col sm={10}>
									<input
										type="password"
										className="form-control"
										id="inputPassword"
										name="password"
										placeholder="*********"
										disabled
									/>
								</Col>
								<Col
									sm={2}
									className="d-flex justify-content-center align-items-end"
								>
									<p className="underline">Modifier</p>
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
							<p className="small-text text-white-50">
								Profil créé le xx/xx/xx. Mis à jour le xx/xx/xx.
							</p>

							<div className="text-center mt-3">
								<CustomButton
									text="Supprimer"
									className="btn-red"
									onClick={handleDelete}
								/>
							</div>
						</form>
					</Row>
				</div>
			</section>
		</>
	);
};

export default ProfilUserPage;
