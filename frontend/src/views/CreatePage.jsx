import { useEffect, useState } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";
import CustomButton from "../components/custom-button/CustomButton";
import FileUpload from "../components/fileUpload/FileUpload";
import useFormStore, { fetchTypes } from "../store/useFormStore";
import { useAuthStore } from "../store/authStore";
import { getCookie } from "../utils/cookieUtils";
import { Navigate } from "react-router-dom";

const CreatePage = () => {
	const { formData, setFormData, resetForm, types } = useFormStore();
	const [file, setFile] = useState(null); // ajout pour stocker l'image
	const { isLoggedIn } = useAuthStore();

	if (!isLoggedIn) {
		return (
			<div className="mt-5 text-center">
				<h6 className="mx-4">
					Pour créer vos propres Pokéflons, connectez-vous !
				</h6>
				<Image
					alt="Logo de DevFreak blanc et noir"
					src="/images/dev-freak_logo-void.png"
					width="100"
					className="mt-3"
				/>
			</div>
		);
	}

	//TODO: gérer la preview ici ou dans fileupload pour que ça s'enlève après submit
	// ou alors envoyer sur la page du pokeflon nouvellement créé...

	//TODO: gérer le switch visibility on ou off

	useEffect(() => {
		// Récupérer les types au montage du composant
		fetchTypes();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(name, value);
	};

	const handleNumberChange = (e) => {
		const { name, value } = e.target;
		// Vérifier si la valeur est un nombre valide
		if (/^\d*\.?\d*$/.test(value)) {
			setFormData(name, value);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		//console.log("Données envoyées : ", formData);

		// Récupérer le token d'authentification depuis le cookie
		const token = getCookie("authToken");

		// Si pas de token, on peut soit afficher un message d'erreur, soit rediriger vers la page de connexion
		if (!token) {
			console.error("Utilisateur non authentifié. Veuillez vous connecter.");
			setErrorMessage("Utilisateur non authentifié. Veuillez vous connecter.");
			return;
		}

		// Utiliser FormData pour inclure l'image et les autres données
		const formDataToSend = new FormData();
		formDataToSend.append("file", file); // Ajoute l'image
		formDataToSend.append("pokeflons", JSON.stringify(formData));
		//console.log("file? :", file);

		for (const key in formData) {
			formDataToSend.append(key, formData[key]); // Ajoute les autres champs
		}

		try {
			const response = await fetch("http://localhost:5000/api/pokeflon", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`, // Ajouter le token dans l'en-tête
				},
				body: formDataToSend,
			});

			if (response.ok) {
				console.log("Pokéflon créé avec succès !");
				resetForm();
				setFile(null); // réinitialise l'image
				// TODO: vérif ici la navigation vers la page, doit être celle du pokéflon qui vient d'être créé
				Navigate("/");
			} else {
				console.error("Erreur lors de la création :", response.statusText);
				setErrorMessage(data.message);
			}
		} catch (error) {
			console.error("Erreur réseau :", error);
			setErrorMessage("Une erreur est survenue lors de la création.");
		}
	};

	return (
		<>
			<section>
				<div className="d-flex justify-content-center">
					<Row className="rounded-2 bg-dark my-3 p-2 ps-5 size-row-create">
						<Form
							method="POST"
							onSubmit={handleSubmit}
							noValidate
							encType="multipart/form-data"
						>
							<Row>
								<Col xs={12} md={5}>
									<Form.Group
										controlId="fileUpload"
										className="mt-1 input-width"
									>
										<Form.Label>
											Importer une photo :
										</Form.Label>
										<FileUpload
											controlId="fileUpload"
											onFileSelected={(selectedFile) => setFile(selectedFile)} // Enregistre l'image dans l'état
										/>
									</Form.Group>
								</Col>

								<Col xs={12} md={7}>
									<Row>
										<Col xs={12} md={6}>
											<Form.Group className="mt-3">
												<Form.Label>Nom :</Form.Label>
												<Form.Control
													type="text"
													name="name"
													id="name"
													autoComplete="name"
													value={formData.name}
													onChange={handleChange}
													placeholder="Nom du Pokéflon"
													className="input-mid-width"
												/>
											</Form.Group>
										</Col>
										<Col xs={12} md={6}>
											<Form.Group className="mt-3">
												<Form.Label>Cri :</Form.Label>
												<Form.Control
													type="text"
													name="sound"
													id="sound"
													value={formData.sound}
													onChange={handleChange}
													placeholder="Cri du Pokéflon"
													className="input-mid-width"
												/>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col xs={12} md={6}>
											<Form.Group className="mt-3">
												<Form.Label>Taille (en m):</Form.Label>
												<Form.Control
													type="text"
													name="height"
													id="height"
													value={formData.height}
													onChange={handleNumberChange}
													placeholder="Taille du Pokéflon (ex. : 10.2)"
													className="input-mid-width"
												/>
											</Form.Group>
										</Col>
										<Col xs={12} md={6}>
											<Form.Group className="mt-3">
												<Form.Label>Poids (en kg):</Form.Label>
												<Form.Control
													type="text"
													name="weight"
													id="weight"
													value={formData.weight}
													onChange={handleNumberChange}
													placeholder="Poids du Pokéflon (ex. : 51.6)"
													className="input-mid-width"
												/>
											</Form.Group>
										</Col>
									</Row>

									<Form.Group
										as={Row}
										controlId="formTypes"
										className="justify-content-center"
									>
										<div className="mt-4">
											<p className="mb-1">
												Type(s) du Pokémon (1 ou 2 maximum) :
											</p>
										</div>
										<Row className="ms-4">
											<Col xs={12} md={6}>
												<Form.Group>
													<Form.Label>Type 1 :</Form.Label>
													<Form.Control
														as="select"
														name="type1"
														id="type1"
														className="input-small-width"
														value={formData.type1 || ""}
														onChange={(e) =>
															setFormData("type1", e.target.value)
														}
													>
														<option value="">Sélectionnez le type</option>
														{types.map((type) => (
															<option key={type._id} value={type._id}>
																{type.type_name}
															</option>
														))}
													</Form.Control>
												</Form.Group>
											</Col>
											<Col xs={12} md={6}>
												<Form.Group>
													<Form.Label>Type 2 :</Form.Label>
													<Form.Control
														as="select"
														name="type2"
														id="type2"
														className="input-small-width"
														value={formData.type2 || ""}
														onChange={(e) =>
															setFormData("type2", e.target.value)
														}
														disabled={
															!formData.type1 ||
															formData.type1 === formData.type2
														} // disable type2 si type1 identique
													>
														<option value="">Sélectionnez le type</option>
														{types
															.filter((type) => type._id !== formData.type1) // exclure type1 de la liste
															.map((type) => (
																<option key={type._id} value={type._id}>
																	{type.type_name}
																</option>
															))}
													</Form.Control>
												</Form.Group>
											</Col>
										</Row>
									</Form.Group>

									<Row>
										<Col xs={12}>
											<Form.Group className="mt-4">
												<Form.Label>Description :</Form.Label>
												<Form.Control
													as="textarea"
													rows={3}
													name="summary"
													id="summary"
													value={formData.summary}
													onChange={handleChange}
													placeholder="Entrez la description du Pokéflon"
													className="textarea-width"
												/>
											</Form.Group>
										</Col>
									</Row>

									<div className="text-center mt-3 mb-2">
										<CustomButton
											type="submit"
											text="Soumettre"
											className="btn-red me-5"
										/>
										<CustomButton
											type="reset"
											text="Réinitialiser"
											className="btn-black"
											onClick={resetForm}
										/>
									</div>
								</Col>
							</Row>
						</Form>
					</Row>
				</div>
			</section>
		</>
	);
};

export default CreatePage;
