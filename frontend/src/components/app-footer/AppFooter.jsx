import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import CustomButton from "../custom-button/CustomButton";
import ModalContact from "../modal-contact/ModalContact";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import "./app-footer.scss";


function AppFooter() {
	const [showContact, setShowContact] = useState(false);
	const handleShowContact = () => setShowContact(true);
	const handleCloseContact = () => setShowContact(false);

	return (
		<>
			<footer className="bg-dark mt-2 px-4">
				<Row>
					<Col md={3}></Col>
					<Col>
						<Row className="justify-content-center">
							<Col xs={12} md={9} className="text-center">
								<ul className="list-inline mb-0 mt-2">
									<li className="list-inline-item">
										<a
											href="https://www.facebook.com/PokemonOfficielFR/?brand_redir=230809307041021&locale=fr_FR"
											className="text-light"
											target="_blank"
											rel="noopener noreferrer"
										>
											<FaFacebook />
										</a>
									</li>
									<li className="list-inline-item">
										<a
											href="https://x.com/pokemonfr?lang=fr"
											className="text-light"
											target="_blank"
											rel="noopener noreferrer"
										>
											<FaXTwitter />
										</a>
									</li>
									<li className="list-inline-item">
										<a
											href="https://www.instagram.com/pokemon.fra/"
											className="text-light"
											target="_blank"
											rel="noopener noreferrer"
										>
											<FaInstagram />
										</a>
									</li>
									<li className="list-inline-item">
										<a
											href="https://www.linkedin.com/company/pokemon/"
											className="text-light"
											target="_blank"
											rel="noopener noreferrer"
										>
											<FaLinkedin />
										</a>
									</li>
								</ul>
							</Col>
						</Row>
						<Row className="mt-2">
							<Col className="text-center mb-1">
								<p className="mb-0">
									&copy; 2024 DevFreak. Site fictif réalisé dans le cadre d'une
									formation.
								</p>
							</Col>
						</Row>
					</Col>

					<Col
						xs={12}
						md={3}
						className="d-flex justify-content-end align-items-center mt-2 mt-md-0 mb-sm-2 position-btn"
					>
						<CustomButton
							text="Contact"
							className="btn-black"
							onClick={handleShowContact}
						/>
					</Col>
				</Row>
			</footer>
			<ModalContact show={showContact} handleClose={handleCloseContact} />
		</>
	);
}

export default AppFooter;
