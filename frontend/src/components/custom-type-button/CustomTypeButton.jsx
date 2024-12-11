// import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";

import "./custom-type-button.scss";

// TODO: bordure qui a disparu au clic ??

const btnTypesColor = [
	{ Id_types: 1, name: "Combat" },
	{ Id_types: 2, name: "Dragon" },
	{ Id_types: 3, name: "Eau" },
	{ Id_types: 4, name: "Électrik" },
	{ Id_types: 5, name: "Feu" },
	{ Id_types: 6, name: "Glace" },
	{ Id_types: 7, name: "Insect" },
	{ Id_types: 8, name: "Normal" },
	{ Id_types: 9, name: "Plante" },
	{ Id_types: 10, name: "Poison" },
	{ Id_types: 11, name: "Psy" },
	{ Id_types: 12, name: "Roche" },
	{ Id_types: 13, name: "Sol" },
	{ Id_types: 14, name: "Spectre" },
	{ Id_types: 15, name: "Vol" },
];

function CustomTypeButton({ onTypeSelect, activeTypeId, typesColor = [] }) {
	const handleTypeSelect = (id) => {
		// Trouver l'objet correspondant dans MongoDB
		const selectedType = btnTypesColor.find((t) => t._id === id);
		if (selectedType) {
			onTypeSelect(selectedType._id); // Passer le _id à onTypeSelect
		}
	};

	return (
		<>
			<Row className="justify-content-center text-center btnStyle g-0">
				{/* Map à travers la liste des types */}
				{btnTypesColor.map((type) => {
					const activeClass = activeTypeId === type._id ? "btn-active" : "";
					const colorClass = typesColor[type.Id_types]
						? `type-${type.Id_types}`
						: "";

					// 2e return dans le map
					return (
						<Col key={type.Id_types}>
							<Button
								className={`mx-3 px-0 text-black my-2 ${activeClass} ${colorClass}`}
								onClick={() => {
									console.log("Bouton cliqué pour le type Id:", type.Id_types);
									handleTypeSelect(type.Id_types);
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

// CustomTypeButton.propTypes = {
// 	onTypeSelect: PropTypes.func.isRequired,
// 	activeTypeId: PropTypes.number,
// 	types: PropTypes.arrayOf(
// 		PropTypes.shape({
// 			Id_types: PropTypes.number,
// 			type_name: PropTypes.string,
// 		})
// 	),
// };

export default CustomTypeButton;
