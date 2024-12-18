import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import useFormStore, { fetchTypes } from "../../store/useFormStore";

import "./custom-type-button.scss";


function CustomTypeButton({ setActiveTypeId }) {
	const [activeBorderType, setActiveBorderType] = useState(null);
	const [error, setError] = useState(null);
	const types = useFormStore((state) => state.types); // Utilisation des types depuis le store Zustand

	useEffect(() => {
		const loadTypes = async () => {
			try {
				await fetchTypes(); // Appel de la fonction pour charger les types
			} catch (err) {
				setError("Erreur lors du chargement des types.");
				console.error(err); // Optionnel, à des fins de debug
			}
		};
		loadTypes();
	}, []); // [] signifie que ce hook s'exécute une seule fois au montage du composant

	return (
		<>
			{error && <div className="alert alert-danger">{error}</div>}{" "}
			{/* Afficher l'erreur */}
			<Row className="justify-content-center text-center btnStyle g-0">
				{/* Map à travers la liste des couleurs de types
				{btnTypesColor.map((type) => {
					const activeClass =
						activeBorderType === type.Id_types ? "btn-active" : "";
					const colorClass = `type-${type.Id_types}`; */}
				{/* Map à travers la liste des types sans bordure active */}
				{types.map((type) => {
					const activeClass = activeBorderType === type.id ? "btn-active" : "";

					// 2e return dans le map return (
					return (
						<Col key={type.id}>
							<Button
								className={`mx-3 px-0 text-black my-2 ${activeClass}`}
								style={{ backgroundColor: type.color }}
								onClick={() => {
									setActiveTypeId(type.id);
									setActiveBorderType(type.id);
								}}
							>
								{type.type_name}
							</Button>
						</Col>
					);
				})}
			</Row>
		</>
	);
}

CustomTypeButton.propTypes = {
	setActiveTypeId: PropTypes.func.isRequired,
};

export default CustomTypeButton;
