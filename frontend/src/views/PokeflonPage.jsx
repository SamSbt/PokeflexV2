import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import CustomCard from "../components/custom-card/CustomCard";
import CustomButton from "../components/custom-button/CustomButton";

import { useParams } from "react-router-dom";
import { usePokeflonStore } from "../store/store";

const PokeflonPage = () => {
	const { id } = useParams();
	const { fetchPokeflonById, isLoading, error } = usePokeflonStore();
	const [pokeflon, setPokeflon] = useState(null);

	useEffect(() => {
		const loadPokeflon = async () => {
			const data = await fetchPokeflonById(id);
			setPokeflon(data);
		};
		loadPokeflon();
	}, [id, fetchPokeflonById]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading Pokéflons: {error}</div>;
	}

	if (!pokeflon) {
    return <div>Aucun Pokéflon trouvé</div>;
  }

	// TODO: faire en sorte d'avoir un affichage différent ici quand user loggedin
	// fonctions des boutons user connected
	// const handleEdit = () => {
	// 	console.log("Vous voulez modifier la carte.");
	// };

	// const handleDelete = () => {
	// 	console.log("Vous voulez supprimer la carte.");
	// };

	//TODO: gérer le switch visibility on ou off dans la createpage puis ici

	return (
		<>
			<section>
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
						<CustomCard
							to={`/pokeflon/${pokeflon._id}`}
							createdBy={
								pokeflon.created_by
									? pokeflon.created_by.username
									: "Utilisateur supprimé"
							}
							name={pokeflon.name}
							sound={pokeflon.sound}
							height={pokeflon.height}
							weight={pokeflon.weight}
							img_src={pokeflon.img_src}
							summary={pokeflon.summary}
							//visibility={pokeflon.visibility}
							types={pokeflon.types}
						/>
					</Col>
				</Row>
				{/* <div className="text-center mt-3 mb-2">
					<CustomButton
						text="Modifier"
						className="btn-black me-5"
						onClick={handleEdit}
					/>
					<CustomButton
						text="Supprimer"
						className="btn-red"
						onClick={handleDelete}
					/>
				</div> */}
			</section>
		</>
	);
};

export default PokeflonPage;
