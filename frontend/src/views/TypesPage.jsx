import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import CustomTypeButton from "../components/custom-type-button/CustomTypeButton";
import CustomCard from "../components/custom-card/CustomCard";
import { usePokeflonStore } from "../store/store";

const TypesPage = () => {
	const { pokeflons, fetchPokeflons, isLoading, error } = usePokeflonStore();
	if (isLoading) return <div>Chargement...</div>;
	if (error) return <div>Erreur : {error}</div>;

	return (
		<>
			<div className="marginSize">
				<CustomTypeButton />
			</div>
			<Container>
				<Row>
					{pokeflons.map((pokeflon) => (
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
