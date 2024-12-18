import { useState } from "react";
import CustomButton from "../components/custom-button/CustomButton";
import { Form, Row, Col } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {
	const [formState, setFormState] = useState({
		username: "",
		email: "",
		password: "",
		passwordConfirm: "",
	});

	const [error, setError] = useState(null); // Pour afficher les erreurs
	const [success, setSuccess] = useState(null); // Pour afficher le succès
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormState((oldState) => {
			return { ...oldState, [name]: value };
		});
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		console.log("formstate registerPage handleFormmSubmit :" + formState);
		// Vérification des mots de passe
		if (formState.password !== formState.passwordConfirm) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		// Créer l'objet à envoyer au backend
		const userData = {
			username: formState.username,
			email: formState.email,
			password: formState.password,
		};

		try {
			// Effectuer la requête POST
			const response = await fetch("http://localhost:5000/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			const result = await response.json();

			// Vérifier la réponse du backend
			if (response.ok) {
				setSuccess("Inscription réussie !");
				setError(null); // Réinitialiser l'erreur si l'inscription a réussi
				// Réinitialiser le formulaire après succès
				setFormState({
					username: "",
					email: "",
					password: "",
					passwordConfirm: "",
				});
			} else {
				setError(result.message || "Erreur lors de l'inscription.");
			}
		} catch (error) {
			setError("Une erreur s'est produite. Veuillez réessayer.");
			console.error(error);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const togglePasswordConfirmVisibility = () => {
		setShowPasswordConfirm(!showPasswordConfirm);
	};

	return (
		<>
			<section className="d-flex justify-content-center align-items-center">
				<Row>
					<Col md={12}>
						<h5 className="mt-5 mb-2 text-center">Bienvenue chez DevFreak !</h5>
						<Form
							className="border border-1 rounded-3 p-3 sizeFormLoginRegister"
							method="POST"
							noValidate
							onSubmit={handleFormSubmit}
						>
							{/* Affichage des erreurs */}
							{error && <div className="alert alert-danger">{error}</div>}
							{success && <div className="alert alert-success">{success}</div>}

							<Form.Group className="mb-3" controlId="inputPseudo">
								<Form.Label>Nom d'utilisateur :</Form.Label>
								<Form.Control
									type="text"
									placeholder="Entrez votre nom d'utilisateur"
									name="username"
									value={formState.username}
									onChange={handleInputChange}
									autoComplete="username"
									required
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="inputEmail">
								<Form.Label>Adresse Email :</Form.Label>
								<Form.Control
									type="email"
									placeholder="Entrez votre email"
									name="email"
									value={formState.email}
									onChange={handleInputChange}
									autoComplete="email"
									required
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="inputPassword">
								<Form.Label>Mot de passe :</Form.Label>
								<div className="position-relative">
									<Form.Control
										type={showPassword ? "text" : "password"}
										placeholder="Entrez votre mot de passe"
										name="password"
										value={formState.password}
										onChange={handleInputChange}
										autoComplete="new-password"
										required
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

							<Form.Group className="mb-3" controlId="inputPasswordConfirm">
								<Form.Label>Confirmez votre mot de passe :</Form.Label>
								<div className="position-relative">
									<Form.Control
										type={showPasswordConfirm ? "text" : "password"}
										placeholder="Confirmez votre mot de passe"
										name="passwordConfirm"
										value={formState.passwordConfirm}
										onChange={handleInputChange}
										autoComplete="new-password"
										required
									/>
									<span
										className="position-absolute top-50 end-0 translate-middle-y me-3 text-black"
										style={{ cursor: "pointer" }}
										onClick={togglePasswordConfirmVisibility}
									>
										{showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
									</span>
								</div>
							</Form.Group>

							<div className="d-flex justify-content-center">
								<CustomButton
									type="submit"
									text="S'inscrire"
									className="btn-red"
								/>
							</div>
						</Form>
					</Col>
				</Row>
			</section>
		</>
	);
};

export default RegisterPage;
