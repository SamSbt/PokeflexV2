import useFormStore, { fetchTypes } from "../store/useFormStore";
import { useEffect } from "react";

import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../components/custom-button/CustomButton";

const CreatePage = () => {
	const { formData, setFormData, resetForm, types } = useFormStore();

	useEffect(() => {
		// Récupérer les types au montage du composant
		fetchTypes();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(name, value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation des types avant soumission
		if (formData.type1 === formData.type2) {
			alert("Les deux types ne peuvent pas être les mêmes !");
			return; // Arrêter la soumission si les types sont identiques
		}

		try {
			const response = await fetch("http://localhost:5000/api/type", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				console.log("Pokéflon créé avec succès !");
				resetForm();
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
						<Form method="" onSubmit={handleSubmit} noValidate>
							<Row>
								<Col xs={12} md={5}>
									<Form.Group
										// controlId="fileUpload"
										className="mt-1 input-width"
									>
										<Form.Label>Importer une photo :</Form.Label>
										{/* <FileUpload /> */}
									</Form.Group>
								</Col>

								<Col xs={12} md={7}>
									<Row>
										<Col xs={12} md={6}>
											<Form.Group className="mt-1">
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
											<Form.Group className="mt-1">
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
													type="number"
													name="height"
													value={formData.height}
													onChange={handleChange}
													placeholder="Taille du Pokéflon (ex. : 10.2)"
													className="input-mid-width"
												/>
											</Form.Group>
										</Col>
										<Col xs={12} md={6}>
											<Form.Group className="mt-3">
												<Form.Label>Poids (en kg):</Form.Label>
												<Form.Control
													type="number"
													name="weight"
													value={formData.weight}
													onChange={handleChange}
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
														disabled={formData.type1 === formData.type2} // Désactivation du type2 si type1 est le même
													>
														<option value="">Sélectionnez le type</option>
														{types
															.filter(
																(type) => type.type_name !== formData.type1
															) // Exclut le type1 de la liste de type2
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
													name="description"
													value={formData.description}
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
