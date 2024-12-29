import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../components/custom-button/CustomButton";
import { useAuthStore } from "../store/authStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
	const [formState, setFormState] = useState({
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [touchedFields, setTouchedFields] = useState({
		email: false,
		password: false,
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	// Store Zustand pour gérer l'état de connexion et le rôle utilisateur
	const { login, loading, setLoading } = useAuthStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormState((oldState) => ({
			...oldState,
			[name]: value,
		}));
		setTouchedFields((prevTouched) => ({
			...prevTouched,
			[name]: true,
		}));
	};

	const validateForm = () => {
		const errors = {};
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

		// Validation de l'email
		if (!emailRegex.test(formState.email)) {
			errors.email = "Email incorrect (format d'email invalide).";
		}

		// Validation du mot de passe
		if (formState.password.length < 8) {
			errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
		}

		setFormErrors(errors);
		setIsFormValid(Object.keys(errors).length === 0);
	};

	useEffect(() => {
		validateForm();
	}, [formState, touchedFields]);

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage("");
		setLoading(true);

		try {
			const { email, password } = formState;
			const data = await login({ email, password });

			if (data.success) {
				setFormState({
					email: "",
					password: "",
				});
				navigate("/");
			} else {
				setErrorMessage(data.message || "Échec de la connexion.");
			}
		} catch (error) {
			console.error("Login failed:", error);
			setErrorMessage("Une erreur est survenue lors de la connexion.");
		} finally {
			setLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<>
			<section className="d-flex justify-content-center align-items-center">
				<Row>
					<Col md={12}>
						<h5 className="mt-4 mb-2 text-center smallerMargin">
							Bon retour parmi nous !
						</h5>
						<Form
							className="border border-1 rounded-3 p-3 sizeFormLoginRegister"
							noValidate
							onSubmit={handleFormSubmit}
						>
							{/* Affichage des erreurs générales */}
							{errorMessage && <p className="text-danger">{errorMessage}</p>}

							<Form.Group className="mb-3" controlId="inputEmail">
								<Form.Label>Adresse Email :</Form.Label>
								<Form.Control
									type="email"
									placeholder="Entrez votre email"
									name="email"
									value={formState.email}
									onChange={handleInputChange}
									isInvalid={!!formErrors.email && touchedFields.email}
									autoComplete="email"
									required
								/>
								{formErrors.email && touchedFields.email && (
									<Form.Control.Feedback type="invalid">
										{formErrors.email}
									</Form.Control.Feedback>
								)}
							</Form.Group>
							<Form.Group className="mb-1" controlId="inputPassword">
								<Form.Label>Mot de passe :</Form.Label>
								<div className="position-relative">
									<Form.Control
										type={showPassword ? "text" : "password"}
										placeholder="Entrez votre mot de passe"
										name="password"
										value={formState.password}
										onChange={handleInputChange}
										isInvalid={!!formErrors.password && touchedFields.password}
										autoComplete="current-password"
										required
									/>
									<span
										className="position-absolute top-50 end-0 translate-middle-y me-4 text-black"
										style={{ cursor: "pointer" }}
										onClick={togglePasswordVisibility}
									>
										{showPassword ? <FaEyeSlash /> : <FaEye />}
									</span>
								</div>
							</Form.Group>
							{/* Affichage du message d'erreur */}
							{formErrors.password && touchedFields.password && (
								<Form.Control.Feedback type="invalid">
									{formErrors.password}
								</Form.Control.Feedback>
							)}

							<div className="text-end mb-3">
								<Link to="" className="text-decoration-none">
									<small className="text-white-50">Mot de passe oublié ?</small>
								</Link>
							</div>
							<div className="d-flex justify-content-center">
								<CustomButton
									type="submit"
									text={loading ? "Chargement..." : "Se connecter"}
									className="btn-red"
									disabled={loading || !isFormValid}
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
									<CustomButton text="S'inscrire" className="btn-black" />
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
