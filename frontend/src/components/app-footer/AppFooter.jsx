import { Col, Row } from "react-bootstrap";

import CustomButton from "../custom-button/CustomButton";
//import Contact from "../contact/Contact";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import "./app-footer.scss";

function AppFooter() {
	// const [showContact, setShowContact] = useState(false);

	// const handleShowContact = () => setShowContact(true);
	// const handleCloseContact = () => setShowContact(false);

	return (
		<>
			{/* Écrans mobiles */}
			<div className="d-md-none">
				<footer className="bg-dark mt-4 px-4">
					<Row className="g-0">
						<Col
							xs={12}
							sm={9}
							className="text-center d-flex flex-column justify-content-center"
						>
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
							<p className="mb-0">
								&copy; 2024 DevFreak. Site fictif réalisé dans le cadre d'une
								formation.
							</p>
						</Col>
						<Col
							xs={12}
							sm={3}
							className="d-flex align-items-center my-2 position-btn"
						>
							<CustomButton
								text="Contact"
								className="btn-black"
								// onClick={handleShowContact}
							/>
						</Col>
					</Row>
				</footer>
				{/* <Contact show={showContact} handleClose={handleCloseContact} /> */}
			</div>

			{/* écrans dekstop */}
			<div className="d-none d-md-block">
				<footer className="bg-dark mt-4 px-4">
					<Row>
						<Col md={3}></Col>
						<Col>
							<Row className="justify-content-center">
								<Col md={6} className="text-center">
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
										&copy; 2024 DevFreak. Site fictif réalisé dans le cadre
										d'une formation.
									</p>
								</Col>
							</Row>
						</Col>

						<Col
							md={3}
							className="d-flex justify-content-end align-items-center"
						>
							<CustomButton
								text="Contact"
								className="btn-black"
								// onClick={handleShowContact}
							/>
						</Col>
					</Row>
				</footer>
				{/* <Contact show={showContact} handleClose={handleCloseContact} /> */}
			</div>
		</>
	);
}

export default AppFooter;
