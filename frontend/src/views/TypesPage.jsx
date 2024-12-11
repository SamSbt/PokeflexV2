import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Row } from "react-bootstrap";
import CustomTypeButton from "../components/custom-type-button/CustomTypeButton";
import CustomCard from "../components/custom-card/CustomCard";
import { usePokeflonStore } from "../store/store";
import useFormStore, { fetchTypes } from "../store/useFormStore";

const TypesPage = () => {
	const [activeTypeId, setActiveTypeId] = useState(null);
	const { pokeflons, isLoading, error, fetchPokeflons } = usePokeflonStore();
	const { types } = useFormStore();

	useEffect(() => {
		const loadTypes = async () => {
			console.log("Types data:", loadTypes);
			await fetchTypes();
			fetchPokeflons(); // récupérer aussi les Pokéflons après les types
		};

		loadTypes();
	}, []);

	const filteredPokeflons = useMemo(() => {
		console.log("Filtrage avec activeTypeId :", activeTypeId);
		if (activeTypeId === 0) {
			return [];
		} else {
			return pokeflons.filter(
				(p) => p.types.some((t) => activeTypeId.includes(t._id)) // Vérifie si l’un des types du Pokéflon correspond à l’un des types sélectionnés
			);
		}
	}, [activeTypeId, pokeflons]);

	// const handleTypeSelect = (typeId) => {
	// 	console.log("Type sélectionné :", typeId);
	// 	setActiveTypeId((prevTypeId) => (prevTypeId === typeId ? null : typeId));
	// };

	// const handleTypeSelect = (mongoId) => {
	// 	console.log("Type MongoDB sélectionné :", mongoId);
	// 	setActiveTypeId((prevTypeId) => (prevTypeId === mongoId ? null : mongoId));
	// };

	const handleTypeSelect = (mongoId) => {
		console.log("Type MongoDB sélectionné :", mongoId);
		setActiveTypeId((prevIds) => {
			const newIds = prevIds.includes(mongoId)
				? prevIds.filter((id) => id !== mongoId)
				: [...prevIds, mongoId];
			return newIds;
		});
	};

	if (isLoading) return <div>Chargement...</div>;
	if (error) return <div>Erreur : {error}</div>;

	return (
		<>
			<div className="marginSize">
				<CustomTypeButton
					onTypeSelect={handleTypeSelect}
					activeTypeId={activeTypeId}
					types={types}
				/>
			</div>
			<Container>
				<Row>
					{filteredPokeflons.map((pokeflon) => (
						<Col
							key={pokeflon._id}
							xs={12}
							sm={6}
							md={4}
							lg={3}
							xl={3}
							xxl={2}
						>
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
