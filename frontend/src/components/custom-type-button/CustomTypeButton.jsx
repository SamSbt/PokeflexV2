// import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";

import "./custom-type-button.scss";
import { useState } from "react";

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

function CustomTypeButton() {
	const [activeBorderType, setActiveBorderType] = useState(null);

	const handleTypeSelect = (id) => {
		//console.log("Clicked type ID:", id);
		setActiveBorderType(id);
	};

	return (
		<>
			<Row className="justify-content-center text-center btnStyle g-0">
				{/* Map à travers la liste des types */}
				{btnTypesColor.map((type) => {
					const activeClass =
						activeBorderType === type.Id_types ? "btn-active" : "";
					const colorClass = `type-${type.Id_types}`;
						

					// 2e return dans le map return (
					return (
						<Col key={type.Id_types}>
							<Button
								className={`mx-3 px-0 text-black my-2 ${activeClass} ${colorClass}`}
								onClick={() => handleTypeSelect(type.Id_types)}
							>
								{type.name}
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
