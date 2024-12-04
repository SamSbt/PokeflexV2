import { Row, Col, Image } from "react-bootstrap";

import "./app-header.scss";

const AppHeader = () => {
	return (
		<>
			<header className="my-4">
				<Row className="header mx-auto">
					<Row className="justify-content-center px-5">
						<Col
							xs="auto"
							className="d-flex justify-content-center align-items-end"
						>
							<Image
								alt="Image du PokéFlex"
								src="/images/pokeflex_illustration.png"
								width="90"
								className="pokeflex-image mb-2"
							/>
							<Image
								alt="Logo du PokéFlex"
								src="/images/pokeflex_logo.svg"
								width="330"
								className="mb-2"
							/>
						</Col>
					</Row>
					<Row className="text-center">
						<h2 className="p-0 m-0">Attrapez les touuuuus</h2>
					</Row>
				</Row>
			</header>
		</>
	);
};

export default AppHeader;
