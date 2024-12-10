import useFormStore, { fetchTypes } from "../store/useFormStore";
import { useEffect, useState } from "react";

import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../components/custom-button/CustomButton";
import FileUpload from "../components/fileUpload/FileUpload";

const CreatePage = () => {
	const { formData, setFormData, resetForm, types } = useFormStore();
	const [file, setFile] = useState(null); // ajout pour stocker l'image

	//TODO: gérer la preview ici ou dans fileupload pour que ça s'enlève après submit
	// ou alors envoyer sur la page du pokeflon nouvellement créé...

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
				body: formDataToSend,
			});

			if (response.ok) {
				console.log("Pokéflon créé avec succès !");
				resetForm();
				setFile(null); // réinitialise l'image
			} else {
				console.error("Erreur lors de la création :", response.statusText);
			}
		} catch (error) {
			console.error("Erreur réseau :", error);
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
										<Form.Label>Importer une photo :</Form.Label>
										<FileUpload
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
													<Form.Label htmlFor="type1">Type 1 :</Form.Label>
													<Form.Control
														as="select"
														id="type1"
														name="type1"
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
													<Form.Label htmlFor="type2">Type 2 :</Form.Label>
													<Form.Control
														as="select"
														id="type2"
														name="type2"
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
