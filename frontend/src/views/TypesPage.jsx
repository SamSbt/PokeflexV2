import React from "react";
import { Container } from "react-bootstrap";
import CustomTypeButton from "../components/custom-type-button/CustomTypeButton";

const HomePage = () => {
	return (
		<>
			<div className="marginSize">
				<CustomTypeButton />
			</div>
			<Container>
				<p className="m-5">Ma TypesPage</p>
			</Container>
		</>
	);
};

export default HomePage;
