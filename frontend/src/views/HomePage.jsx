import React, { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import CustomFilterButton from "../components/custom-filter-button/CustomFilterButton";
import CustomCard from "../components/custom-card/CustomCard";

import { useStore, usePokeflonStore } from "../store/store";
import { Link } from "react-router-dom";

const HomePage = () => {
	const { pokeflons, fetchPokeflons, loadingPokeflons } = usePokeflonStore();
	const { username, isLoggedIn } = useStore();

	useEffect(() => {
		fetchPokeflons();
	}, [fetchPokeflons]);

	// TODO : affichage des types sur la carte de base ?
	// TODO: à partir de 1200 et jusqu à 1400, pb avec gap entre les cards ?

	const cardsHomepageView = (
		<Row className="mt-2 justify-content-center gap-3">
			{pokeflons.map((pokeflon) => (
				<Col
					key={pokeflon.id}
					xs={12}
					sm={6}
					md={4}
					lg={3}
					xl={3}
					xxl={2}
					className="d-flex justify-content-center"
				>
					<CustomCard
						to={`/pokeflon/${pokeflon.id}`}
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
			<section>
				{isLoggedIn && (
					<h3 className="mt-5 text-center">
						Bienvenue{" "}
						<Link to={`/login/${username}`} className="underline custom-homepage-link">
							{username}
						</Link>
					</h3>
				)}

				<Container>
					{loadingPokeflons ? (
						<div className="col-12 text-center mt-5">
							<Spinner animation="grow" variant="dark" />
						</div>
					) : pokeflons.length > 0 ? (
						<Row className="mt-5 justify-content-center">
							{cardsHomepageView}
						</Row>
					) : (
						<p className="col-12 text-center mt-5">Aucun Pokéflon trouvé.</p>
					)}
				</Container>
			</section>
		</>
	);
};

export default HomePage;
