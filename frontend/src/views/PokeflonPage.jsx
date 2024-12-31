import React, { useEffect, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import CustomCard from "../components/custom-card/CustomCard";
import CustomButton from "../components/custom-button/CustomButton";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePokeflonStore } from "../store/store";
import { useAuthStore } from "../store/authStore";

const PokeflonPage = () => {
	const { id } = useParams();
	const { fetchPokeflonById, loadingPokeflonsById, error } = usePokeflonStore();
	const { username, userRole, isLoggedIn } = useAuthStore();
	const [pokeflon, setPokeflon] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const loadPokeflon = async () => {
			const data = await fetchPokeflonById(id);
			setPokeflon(data);
		};
		loadPokeflon();
	}, [id, fetchPokeflonById]);

	if (error) {
		return <div>Error loading Pokéflons: {error}</div>;
	}
	if (loadingPokeflonsById) {
		return (
			<div className="text-center">
				<Spinner animation="grow" variant="dark" />
			</div>
		);
	}
	if (!pokeflon) {
		return <div>Aucun Pokéflon trouvé</div>;
	}

	const canEditOrDelete =
		isLoggedIn &&
		(userRole === "Admin" ||
			(userRole === "Dresseur" && username === pokeflon.created_by.username));

	// fonctions des boutons user connected
	const handleEdit = () => {
		if (pokeflon && pokeflon.id) {
			navigate(`/create/${pokeflon.id}`);
		}
	};

	const handleDelete = () => {
		console.log("Vous voulez supprimer la carte.");
	};

	//TODO: gérer le switch visibility on ou off dans la createpage puis ici

	return (
		<>
			<section>
				<Link
					to="/"
					className="ms-3 text-light text-decoration-none"
					aria-label="Retour à la page d'accueil"
				>
					<FaArrowAltCircleLeft /> Page d'accueil
				</Link>
				<Row className="mt-1 text-center">
					<Col
						xs={12}
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
							types={pokeflon.types}
							size="large"
						/>
					</Col>
				</Row>
				{canEditOrDelete && (
					<div className="text-center mb-2">
						<CustomButton
							text="Modifier"
							className="btn-red me-5"
							onClick={handleEdit}
						/>
						<CustomButton
							text="Supprimer"
							className="btn-black"
							onClick={handleDelete}
						/>
					</div>
				)}
			</section>
		</>
	);
};

export default PokeflonPage;
