import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Modal, Form } from "react-bootstrap";

import "./modal-contact.scss";
import CustomButton from "../custom-button/CustomButton";

function Contact({ show, handleClose }) {
	const [formState, setFormState] = useState({
		username: "",
		email: "",
		subject: "",
		message: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [status, setStatus] = useState(null);
	const timeoutRef = useRef(null);

	// erreurs de typo maj en tps réel
	useEffect(() => {
		validateForm();
	}, [formState]);

	const validateForm = () => {
		const errors = {};
		if (formState.username.trim().length < 5) {
			errors.username = "Nom incorrect (5 caractères minimum).";
		}
		const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (!emailRegex.test(formState.email)) {
			errors.email = "Email incorrect (format d'email invalide).";
		}
		if (formState.subject.trim().length < 3) {
			errors.subject = "Objet trop court (3 caractères minimum).";
		}
		if (formState.message.trim().length < 5) {
			errors.message = "Message incorrect (5 caractères minimum).";
		}
		setFormErrors(errors);
		setIsFormValid(Object.keys(errors).length === 0);
	};

	// mettre à jour l'état du formulaire en temps réel qd utilisation par user
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormState((oldState) => {
			// console.log("handleinputchange modalcontact :", name, value);
			return { ...oldState, [name]: value };
		});
	};

	const resetForm = () => {
		setFormState({
			username: "",
			email: "",
			subject: "",
			message: "",
		});
		setStatus(null);
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		console.log("Form submitted ??", formState);

		try {
			const url = "http://localhost:5000/api/contact";
			const options = {
				method: "POST",
				body: JSON.stringify(formState),
				headers: {
					"Content-Type": "application/json",
				},
			};

			const response = await fetch(url, options);
			console.log("modal contact response :", response);

			if (!response.ok) {
				const result = await response.json();
				if (response.status === 400 && result.errors) {
					// afficher les erreurs de validation côté frontend
					setFormErrors(
						result.errors.reduce((acc, error) => {
							acc[error.param] = error.msg;
							return acc;
						}, {})
					);
				} else {
					throw new Error(result.message || "Erreur de réseau");
				}
			} else {
				setStatus("success");
				setTimeout(() => {
					resetForm(); // Réinitialisation du formulaire après 10 secondes
				}, 10000);
			}
		} catch (error) {
			console.error("Erreur lors de la soumission du formulaire", error);
			setStatus("error");
		}
	};

	// réinitialisation du form à la fermeture du modal
	const handleCloseModal = () => {
		resetForm();
		handleClose();
	};

	// appliquer dynamiquement class css selon état et erreurs dans form
	const getInputClass = (field) => {
		if (formState[field] === "") return "form-control";
		return formErrors[field] && formState[field].length > 0
			? "form-control is-invalid"
			: "form-control is-valid";
	};

	return (
		<>
			<Modal
				show={show}
				onHide={handleCloseModal}
				data-bs-theme="dark"
				className="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Contactez-nous</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="contactForm" onSubmit={handleFormSubmit} noValidate>
						<Form.Group
							className={`${getInputClass("username")} mb-3`}
							controlId="contactUsername"
						>
							<Form.Label>Nom d'utilisateur</Form.Label>
							<Form.Control
								type="text"
								placeholder="John Smith"
								name="username"
								value={formState.username}
								onChange={handleInputChange}
								autoFocus
							/>
							{formErrors.username && formState.username.length > 0 && (
								<div className="invalid-feedback d-block text-light">
									{formErrors.username}
								</div>
							)}
						</Form.Group>
						<Form.Group
							className={`${getInputClass("email")} mb-3`}
							controlId="contactEmail"
						>
							<Form.Label>Adresse Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="nom@exemple.com"
								name="email"
								value={formState.email}
								onChange={handleInputChange}
							/>
							{formErrors.email && formState.email.length > 0 && (
								<div className="invalid-feedback d-block text-light">
									{formErrors.email}
								</div>
							)}
						</Form.Group>
						<Form.Group
							className={`${getInputClass("subject")} mb-3`} // Ajout de l'objet
							controlId="contactSubject"
						>
							<Form.Label>Objet</Form.Label>
							<Form.Control
								type="text"
								placeholder="Objet du message"
								name="subject"
								value={formState.subject}
								onChange={handleInputChange}
							/>
							{formErrors.subject && formState.subject.length > 0 && (
								<div className="invalid-feedback d-block text-light">
									{formErrors.subject}
								</div>
							)}
						</Form.Group>
						<Form.Group
							className={`${getInputClass("message")} mb-3`}
							controlId="contactMessage"
						>
							<Form.Label>Votre message</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Écrivez ici..."
								name="message"
								value={formState.message}
								onChange={handleInputChange}
							/>
							{formErrors.message && formState.message.length > 0 && (
								<div className="invalid-feedback d-block text-light">
									{formErrors.message}
								</div>
							)}
						</Form.Group>

						<Modal.Footer className="justify-content-center flex-column">
							<CustomButton
								type="submit"
								text="Envoyer"
								className="btn-red"
								disabled={!isFormValid}
							/>
							{status === "success" && (
								<div className="mt-3">
									Merci pour votre message {formState.username}.<br />
									Si besoin, vous recevrez très prochainement une réponse à
									l&apos;adresse email indiquée : {formState.email}.
								</div>
							)}
							{status === "error" && (
								<div className="mt-3">
									Une erreur est survenue lors de l'envoi du message.
									<br />
									Merci de réessayer ultérieurement.
								</div>
							)}
						</Modal.Footer>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
}

Contact.propTypes = {
	show: PropTypes.bool.isRequired, // 'show' doit être un booléen et est requis
	handleClose: PropTypes.func.isRequired, // 'handleClose' doit être une fonction et est requise
};

export default Contact;
