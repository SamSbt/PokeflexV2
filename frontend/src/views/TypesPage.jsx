import React, { useState, useEffect, useMemo } from "react";
import { Col, Container, Image, Row, Spinner } from "react-bootstrap";
import CustomTypeButton from "../components/custom-type-button/CustomTypeButton";
import CustomCard from "../components/custom-card/CustomCard";
import { usePokeflonStore } from "../store/store";

const TypesPage = () => {
	const [activeTypeId, setActiveTypeId] = useState(null);
	const { pokeflons, error, fetchPokeflonsByIdType, loadingPokeflonsByType } =
		usePokeflonStore();

	useEffect(() => {
		if (activeTypeId !== null) {
			fetchPokeflonsByIdType(activeTypeId); // Filtrer les Pokéflons par type
		}
	}, [activeTypeId, fetchPokeflonsByIdType]); // Re-exécute quand activeTypeId change

	const filteredPokeflons = useMemo(() => {
		if (!pokeflons || !Array.isArray(pokeflons)) return [];
		if (activeTypeId === null) return [];

		return pokeflons.filter((pokeflon) =>
			pokeflon.types?.some(
				(type) => type._id.toString() === activeTypeId.toString()
			)
		);
	}, [pokeflons, activeTypeId]);

	if (error) return <div>Erreur : {error}</div>;

	return (
		<>
			<div className="marginSize my-3">
				<CustomTypeButton setActiveTypeId={setActiveTypeId} />
			</div>
			<Container>
				{loadingPokeflonsByType ? (
					<div className="text-center">
						<Spinner animation="grow" variant="dark" />
					</div>
				) : activeTypeId === null ? (
					<div className="d-flex flex-column align-items-center mt-5">
						<Image
							alt="Logo de DevFreak blanc et noir"
							src="/images/dev-freak_logo-void.png"
							width="100"
							className="mb-3"
						/>
						<p className="text-center mt-3 mx-4">
							Cliquez sur un type pour voir la liste des Pokéflons déjà créés !
						</p>
					</div>
				) : filteredPokeflons.length > 0 ? (
					<Row className="mt-5 justify-content-center gap-3">
						{filteredPokeflons.map((pokeflon) => (
							<Col
								key={pokeflon._id}
								xs={12}
								sm={6}
								md={6}
								lg={4}
								xl={3}
								xxl={3}
								className="d-flex justify-content-center"
							>
								<CustomCard
									to={`/pokeflon/${pokeflon._id}`}
									name={pokeflon.name}
									createdBy={
										pokeflon.created_by
											? pokeflon.created_by.username
											: "Utilisateur supprimé"
									}
									img_src={pokeflon.img_src}
									types={pokeflon.types
										.map((type) => type.type_name)
										.join(", ")}
									size="small"
								/>
							</Col>
						))}
					</Row>
				) : (
					<div className="d-flex flex-column align-items-center mt-5">
						<Image
							alt="Logo de DevFreak blanc et noir"
							src="/images/dev-freak_logo-void-tear.png"
							width="100"
							className="mb-3"
						/>
						<p className="text-center mt-3 mx-4">
							Aucun Pokéflon trouvé pour ce type.
						</p>
					</div>
				)}
			</Container>
		</>
	);
};

export default TypesPage;
