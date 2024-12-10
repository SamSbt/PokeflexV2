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

	// TODO : affichage des types sur la carte de base ?
	// TODO: à partir de 1200 et jusqu à 1400, pb avec gap entre les cards ?

	return (
		<>
			<CustomFilterButton />
			<Container>
				<Row className="mt-5 justify-content-center gap-3">
					{pokeflons.map((pokeflon) => (
						<Col
							xs={12}
							sm={6}
							md={4}
							lg={3}
							xl={3}
							xxl={2}
							key={pokeflon._id}
							className="d-flex justify-content-center"
						>
							<CustomCard
								to={`/pokeflon/${pokeflon._id}`}
								name={pokeflon.name}
								createdBy={pokeflon.createdBy}
								img_src={pokeflon.img_src}
								types={pokeflon.types.map((type) => type.type_name).join(", ")}
							/>
						</Col>
					))}
				</Row>
			</Container>
		</>
	);
};

export default HomePage;
