import React from "react";
import CustomFilterButton from "../components/custom-filter-button/CustomFilterButton";
import { Container, Row } from "react-bootstrap";

const HomePage = () => {
	return (
		<>
			<CustomFilterButton />
			<Container>
				<Row className="mt-5 justify-content-center">
					<Col
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={3}
						xxl={2}
						key={pokeflon.id}
						className="d-flex justify-content-center"
					>
						<Cards
							to={`/pokeflon/${pokeflon.id}`}
							name={pokeflon.name}
							id={pokeflon.id}
							imageSrc={pokeflon.imageSrc}
							types={pokeflon.types.join(", ")}
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default HomePage;
