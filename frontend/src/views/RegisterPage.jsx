import ReCAPTCHA from "react-google-recaptcha";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
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

	const [formErrors, setFormErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [touchedFields, setTouchedFields] = useState({
		username: false,
		email: false,
		password: false,
		passwordConfirm: false,
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const [recaptchaResponse, setRecaptchaResponse] = useState(null);
	const { login, setLoading } = useAuthStore();
	const navigate = useNavigate();

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormState((oldState) => ({
			...oldState,
			[name]: value,
		}));
		setTouchedFields((prevTouched) => ({
			...prevTouched,
			[name]: true,
		}));
		validateForm();
	};

	const validateForm = () => {
		const errors = {};

		// Vérifier la longueur du nom d'utilisateur
		if (formState.username.trim().length < 2 && touchedFields.username) {
			errors.username = "Nom incorrect (2 à 25 caractères maximum).";
		}

		// Vérifier l'email
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (!emailRegex.test(formState.email) && touchedFields.email) {
			errors.email = "Email incorrect (format d'email invalide).";
		}

		// Vérifier la longueur du mot de passe
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (
			touchedFields.password && // Vérifier si l'utilisateur a touché le champ
			!passwordRegex.test(formState.password)
		) {
			errors.password =
				"Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule et un caractère spécial.";
		}

		// Vérifier la confirmation du mot de passe
		if (
			formState.password !== formState.passwordConfirm &&
			touchedFields.passwordConfirm
		) {
			errors.passwordConfirm = "Les mots de passe ne correspondent pas.";
		}

		setFormErrors(errors);
		setIsFormValid(
			Object.keys(errors).length === 0 && recaptchaResponse !== null
		);
	};

	useEffect(() => {
		validateForm();
	}, [formState, recaptchaResponse]);

		const handleRecaptchaChange = (value) => {
			setRecaptchaResponse(value);
		};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setFormErrors({});
		//console.log("formstate registerPage handleFormSubmit :", formState);

if (!recaptchaResponse) {
	setFormErrors({ recaptcha: "Le reCAPTCHA est requis." });
	setLoading(false);
	return;
}

		// créer l'objet à envoyer au backend
		const userData = {
			username: formState.username,
			email: formState.email,
			password: formState.password,
			recaptchaResponse: recaptchaResponse,
		};

		try {
			// Effectuer la requête POST
			const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
				credentials: "include",
			});

			const result = await response.json();

			// Vérifier la réponse du backend
			if (response.ok) {
				const loginResult = await login({
					email: formState.email,
					password: formState.password,
				});

				// redirige vers user profile page		
				if (loginResult.success) {
					navigate(`/login/${result.data.id}`);
					// réinitialiser le formulaire après succès
					setFormState({
						username: "",
						email: "",
						password: "",
						passwordConfirm: "",
					});
					setTouchedFields({
						username: false,
						email: false,
						password: false,
						passwordConfirm: false,
					});
				} else {
					setFormErrors({ general: "Échec de la connexion automatique." });
				}
			} else {
				setFormErrors({
					general: result.message || "Erreur lors de l'inscription.",
				});
			}
		} catch (error) {
			console.error("Erreur lors de l'inscription:", error);
			setFormErrors({
				general: "Une erreur s'est produite. Veuillez réessayer.",
			});
		} finally {
			setLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const togglePasswordConfirmVisibility = () => {
		setShowPasswordConfirm(!showPasswordConfirm);
	};

	const getInputClass = (field) => {
		if (!formState[field]) return "form-control";
		return formErrors[field]
			? "form-control is-invalid"
			: "form-control is-valid";
	};

	return (
		<section className="d-flex justify-content-center align-items-center">
			<Row>
				<Col md={12}>
					<h5 className="mt-4 mb-2 text-center">Bienvenue chez DevFreak !</h5>
					<Form
						className="border border-1 rounded-3 p-3 sizeFormLoginRegister"
						method="POST"
						noValidate
						onSubmit={handleFormSubmit}
					>
						{formErrors.general && (
							<div className="alert alert-danger">{formErrors.general}</div>
						)}
						<Form.Group className="mb-3" controlId="inputPseudo">
							<Form.Label>Nom d'utilisateur :</Form.Label>
							<Form.Control
								type="text"
								placeholder="Entrez votre nom d'utilisateur"
								name="username"
								value={formState.username}
								onChange={handleInputChange}
								autoComplete="username"
								isInvalid={!!formErrors.username}
							/>
							{formErrors.username && touchedFields.username && (
								<div className="invalid-feedback">{formErrors.username}</div>
							)}
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
								isInvalid={!!formErrors.email}
							/>
							{formErrors.email && touchedFields.email && (
								<div className="invalid-feedback">{formErrors.email}</div>
							)}
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
									isInvalid={!!formErrors.password && touchedFields.password}
								/>
								<span
									className="position-absolute top-50 end-0 translate-middle-y me-4 text-black"
									style={{ cursor: "pointer", zIndex: 10 }}
									onClick={togglePasswordVisibility}
								>
									{showPassword ? <FaEyeSlash /> : <FaEye />}
								</span>
							</div>
							{formErrors.password && touchedFields.password && (
								<Form.Control.Feedback type="invalid" className="d-block">
									{formErrors.password}
								</Form.Control.Feedback>
							)}
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
									isInvalid={!!formErrors.passwordConfirm}
								/>
								<span
									className="position-absolute top-50 end-0 translate-middle-y me-4 text-black"
									style={{ cursor: "pointer" }}
									onClick={togglePasswordConfirmVisibility}
								>
									{showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
								</span>
							</div>
							{formErrors.passwordConfirm && (
								<div className="invalid-feedback">
									{formErrors.passwordConfirm}
								</div>
							)}
						</Form.Group>

						<Form.Group className="mb-3">
							<ReCAPTCHA
								sitekey="6Lf3JKkqAAAAAIfXPXZQ-ZhWdMEWDmvXuhvgXvw-"
								onChange={handleRecaptchaChange}
							/>
							{formErrors.recaptcha && (
								<div className="text-danger mt-2">{formErrors.recaptcha}</div>
							)}
						</Form.Group>

						<div className="d-flex justify-content-center">
							<CustomButton
								type="submit"
								text="S'inscrire"
								className="btn-red"
								disabled={!isFormValid}
							/>
						</div>
					</Form>
				</Col>
			</Row>
		</section>
	);
};

export default RegisterPage;
