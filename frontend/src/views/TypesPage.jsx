import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CustomTypeButton from "../components/custom-type-button/CustomTypeButton";
import CustomCard from "../components/custom-card/CustomCard";
import { usePokeflonStore } from "../store/store";
import useFormStore, { fetchTypes } from "../store/useFormStore";

const TypesPage = () => {
	const [activeTypeId, setActiveTypeId] = useState(null);
	const { pokeflons, isLoading, error, fetchPokeflons } = usePokeflonStore();
	//const { types } = useFormStore();

	// useEffect(() => {
	// 	const loadTypes = async () => {
	// 		await fetchTypes();
	// 		fetchPokeflons(); // récupérer aussi les Pokéflons après les types
	// 	};

	// 	loadTypes();
	// }, []);

	const filteredPokeflons = useMemo(() => {
		if (!pokeflons || !Array.isArray(pokeflons)) return [];
		if (activeTypeId === null) return [];

		return pokeflons.filter((pokeflon) =>
			pokeflon.types?.some((type) => type.includes(activeTypeId))
		);
	}, [pokeflons, activeTypeId]);



	if (isLoading) return <div>Chargement...</div>;
	if (error) return <div>Erreur : {error}</div>;

	return (
		<>
			<div className="marginSize my-3">
				<CustomTypeButton
				/>
			</div>
			<Container>
				<Row className="mt-5">
					{filteredPokeflons.map((pokeflon) => (
						<Col key={pokeflon._id} xs={12} sm={6} md={4} lg={3} xl={3} xxl={2}>
							<CustomCard
								to={`/pokeflon/${pokeflon._id}`}
								name={pokeflon.name}
								createdBy={pokeflon.createdBy}
								img_src={pokeflon.img_src}
								types={pokeflon.types}
							/>
						</Col>
					))}
				</Row>
			</Container>
		</>
	);
};

export default TypesPage;
