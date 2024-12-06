import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CustomFilterButton from "../components/custom-filter-button/CustomFilterButton";
import CustomCard from "../components/custom-card/CustomCard";

import { usePokeflonStore } from "../store/store";

const HomePage = () => {
	const { pokeflons, fetchPokeflons, isLoading, error } = usePokeflonStore();

	useEffect(() => {
		fetchPokeflons();
	}, [fetchPokeflons]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading Pokéflons: {error}</div>;
	}

	return (
		<>
			<CustomFilterButton />
			<Container>
				<Row className="mt-5 justify-content-center">
					{pokeflons.map((pokeflon) => (
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
							<CustomCard
								to={`/${pokeflon.id}`}
								name={pokeflon.name}
								id={pokeflon.id}
								imageSrc={pokeflon.imageSrc}
								types={pokeflon.types.join(", ")}
							/>
						</Col>
					))}
				</Row>
			</Container>
		</>
	);
};

export default HomePage;
