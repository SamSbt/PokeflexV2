import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../components/custom-button/CustomButton";

const LoginPage = () => {
	const [formState, setFormState] = useState({
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	  const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormState((oldState) => {
			return { ...oldState, [name]: value };
		});
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage("");

		const { email, password } = formState;

		try {
			// Envoi de la requête de connexion
			const response = await fetch("http://localhost:5000/api/auth/login", {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (data.success) {
				// Stocker le token dans localStorage
				localStorage.setItem("authToken", data.data.token);
				navigate("/dashboard"); // Rediriger vers le Dashboard après la connexion
			} else {
				setErrorMessage(data.message); // Afficher un message d'erreur si la connexion échoue
			}
		} catch (error) {
			setErrorMessage("Une erreur est survenue lors de la connexion.");
		} finally {
			setLoading(false);
		}

		// Réinitialiser l'état après la soumission
		setFormState({
			email: "",
			password: "",
		});
	};

	return (
		<>
			<section className="d-flex justify-content-center align-items-center">
				<Row>
					<Col md={12}>
						<h5 className="mt-5 mb-2 text-center">Bon retour parmi nous !</h5>
						<Form
							className="border border-1 rounded-3 p-3 sizeFormLoginRegister"
							noValidate
							onSubmit={handleFormSubmit}
						>
							<Form.Group className="mb-3" controlId="inputEmail">
								<Form.Label>Adresse Email :</Form.Label>
								<Form.Control
									type="email"
									placeholder="Entrez votre email"
									name="email"
									value={formState.email}
									onChange={handleInputChange}
									isInvalid={!!formErrors.email}
									required
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.email}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="mb-1" controlId="inputPassword">
								<Form.Label>Mot de passe :</Form.Label>
								<Form.Control
									type="password"
									placeholder="Entrez votre mot de passe"
									name="password"
									value={formState.password}
									onChange={handleInputChange}
									required
								/>
							</Form.Group>
							{/* Affichage du message d'erreur */}
							{errorMessage && (
								<p className="text-danger">{errorMessage}</p>
							)}{" "}
							<div className="text-end mb-3">
								<Link to="" className="text-decoration-none">
									<small className="text-white-50">Mot de passe oublié ?</small>
								</Link>
							</div>
							{/* <div className="d-flex justify-content-center">
								<Link to="/login/:id">
									<CustomButton
										type="submit"
										text="Se connecter"
										className="btn-black"
										disabled={!isFormValid}
									/>
								</Link>
							</div> */}
							<div className="d-flex justify-content-center">
								<CustomButton
									type="submit"
									text={loading ? "Chargement..." : "Se connecter"}
									className="btn-black"
									disabled={loading || !formState.email || !formState.password}
								/>
							</div>
							<h6 className="mt-4 mb-2 text-center">
								Ou alors <span className="underline">bienvenue</span> !
							</h6>
							<p className="text-center small-text mb-2">
								Pas encore de compte ? Rejoignez-nous :
							</p>
							<div className="d-flex justify-content-center">
								<Link to="/register">
									<CustomButton text="S'inscrire" className="btn-red" />
								</Link>
							</div>
						</Form>
					</Col>
				</Row>
			</section>
		</>
	);
};

export default LoginPage;
