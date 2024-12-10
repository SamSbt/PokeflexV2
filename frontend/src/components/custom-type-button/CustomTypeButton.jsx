// import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";

import { useState } from "react";

import "./custom-type-button.scss";

// TODO: bordure qui a disparu au clic ??

const pokemonTypes = [
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

//{types, onClick, isActive }
function CustomTypeButton() {
	// const typeClass = `type-${types.Id_types}`;
	// const activeClass = isActive ? "btn-active" : "";
	const [activeTypeId, setActiveTypeId] = useState(null);

	const handleTagClick = (id) => {
		//console.log("Clicked type ID:", id);
		setActiveTypeId(id);
	};

	return (
		<>
			<Row className="justify-content-center text-center btnStyle g-0">
				{/* Map à travers la liste des types */}
				{pokemonTypes.map((type) => {
					const typeClass = `type-${type.Id_types}`;
					const activeClass =
						activeTypeId === type.Id_types ? "btn-active" : "";

					// 2e return dans le map
					return (
						<Col key={type.Id_types}>
							<Button
								className={`mx-3 px-0 text-black my-2 ${typeClass} ${activeClass}`}
								onClick={() => handleTagClick(type.Id_types)}
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

// Tag.propTypes = {
// 	types: PropTypes.shape({
// 		Id_types: PropTypes.number.isRequired,
// 		name: PropTypes.string.isRequired,
// 	}).isRequired,
// 	onClick: PropTypes.func.isRequired,
// 	isActive: PropTypes.bool.isRequired,
// };

export default CustomTypeButton;
