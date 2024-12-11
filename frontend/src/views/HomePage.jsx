import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CustomFilterButton from "../components/custom-filter-button/CustomFilterButton";
import CustomCard from "../components/custom-card/CustomCard";

import { usePokeflonStore } from "../store/store";

const HomePage = () => {
	const [loading, setLoading] = useState(true);
	const { pokeflons, fetchPokeflons } = usePokeflonStore();

useEffect(() => {
	setLoading(true);
	fetchPokeflons().finally(() => setLoading(false));
}, [fetchPokeflons]);

	// TODO : affichage des types sur la carte de base ?
	// TODO: à partir de 1200 et jusqu à 1400, pb avec gap entre les cards ?

	const cardsHomepageView = (
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
	);

	return (
		<>
			<CustomFilterButton />
			<Container>
				{loading && (
					<p className="col-12 text-center mt-5">Chargement des données...</p>
				)}
				{pokeflons.length > 0 ? (
					<Row className="mt-5 justify-content-center">{cardsHomepageView}</Row>
				) : (
					!loading && (
						<p className="col-12 text-center mt-5">Aucun Pokéflon trouvé.</p>
					)
				)}
			</Container>
		</>
	);
};

export default HomePage;
