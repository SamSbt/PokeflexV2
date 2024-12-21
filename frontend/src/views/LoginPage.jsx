import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
import CustomButton from "../components/custom-button/CustomButton";
import { useAuthStore } from "../store/authStore";
import { setCookie } from "../utils/cookieUtils";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
	const [formState, setFormState] = useState({
		email: "",
		password: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const navigate = useNavigate();

	// Store Zustand pour gérer l'état de connexion et le rôle utilisateur
	const { login, setLoginStatus, setUserRole, setUsername } = useAuthStore();

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
			// Use the login method from authStore
			const data = await login({ email, password });

			console.log("Réponse de l'API:", data);

			if (data.success) {
				// Mise à jour du store Zustand
				setLoginStatus(true);
				console.log("User role from API:", data.data.user.role);
				setUserRole(data.data.user.role);
				setUsername(data.data.user.username);
				// Stocker le token dans le cookie
				setCookie("authToken", data.data.accessToken);
				// Stocker le refresh token dans le cookie
				setCookie("refreshToken", data.data.refreshToken);
				navigate("/");
			} else {
				setErrorMessage(data.message);
			}
		} catch (error) {
			console.error("Erreur lors de la connexion:", error);
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
							<Form.Group className="mb-3" controlId="inputEmail">
								<Form.Label>Adresse Email :</Form.Label>
								<Form.Control
									type="email"
									placeholder="Entrez votre email"
									name="email"
									value={formState.email}
									onChange={handleInputChange}
									isInvalid={!!formErrors.email}
									autoComplete="email"
									required
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.email}
								</Form.Control.Feedback>
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
										autoComplete="current-password"
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
							{/* Affichage du message d'erreur */}
							{errorMessage && (
								<p className="text-danger">{errorMessage}</p>
							)}{" "}
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
