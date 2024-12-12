import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import CustomFilterButton from "../components/custom-filter-button/CustomFilterButton";
import CustomCard from "../components/custom-card/CustomCard";

import { usePokeflonStore } from "../store/store";

const HomePage = () => {
	const { pokeflons, fetchPokeflons, loadingPokeflons } = usePokeflonStore();

	useEffect(() => {
		fetchPokeflons().finally(() => loadingPokeflons(false));
	}, [fetchPokeflons]);

	// TODO : affichage des types sur la carte de base ?
	// TODO: à partir de 1200 et jusqu à 1400, pb avec gap entre les cards ?

	const cardsHomepageView = (
		<Row className="mt-5 justify-content-center gap-3">
			{pokeflons.map((pokeflon) => (
				<Col
					key={pokeflon._id}
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={3}
					xxl={2}
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
				{loadingPokeflons ? (
					<div className="col-12 text-center mt-5">
						<Spinner animation="grow" variant="dark" />
					</div>
				) : pokeflons.length > 0 ? (
					<Row className="mt-5 justify-content-center">{cardsHomepageView}</Row>
				) : (
					<p className="col-12 text-center mt-5">Aucun Pokéflon trouvé.</p>
				)}
			</Container>
		</>
	);
};

export default HomePage;
