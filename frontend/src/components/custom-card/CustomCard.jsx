import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./custom-card.scss";

function CustomCard({
	to,
	name,
	img_src,
	types,
	sound,
	height,
	weight,
	summary,
	createdBy,
}) {
	return (
		<>
			<Card
				as={Link}
				to={to}
				className="text-decoration-none mb-4 cardStyle bg-dark text-light"
			>
				<div className="d-flex justify-content-center m-3">
					<Card.Img
						variant="top"
						src={`http://localhost:5000/api/${img_src}`}
						// src={`/uploads/${img_src}`}
						alt={`Image du Pokéflon ${name}`}
					/>
				</div>
				<Card.Body>
					<Card.Title>{name}</Card.Title>

					<Card.Subtitle className="my-3 text-light poppins-light small-text">
						Created by : {createdBy}
					</Card.Subtitle>
					{/* TODO : changer ici pour un created by
					cmt connecter username au created by ? */}
					<hr />
					<Card.Text className="small-text">
						Type(s) :{" "}
						{Array.isArray(types)
							? types.map((type) => type.type_name).join(", ")
							: types}
					</Card.Text>
					{sound && <Card.Text className="small-text">Cri : {sound}</Card.Text>}
					{height && (
						<Card.Text className="small-text">Taille : {height} cm</Card.Text>
					)}
					{weight && (
						<Card.Text className="small-text">Poids : {weight} kg</Card.Text>
					)}
					{summary && <Card.Text className="mt-3">{summary}</Card.Text>}
				</Card.Body>
			</Card>
		</>
	);
}

CustomCard.propTypes = {
	to: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	img_src: PropTypes.string.isRequired,
	types: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.object),
]).isRequired,
	sound: PropTypes.string,
	height: PropTypes.number,
	weight: PropTypes.number,
	summary: PropTypes.string,
	createdBy: PropTypes.string,
};

export default CustomCard;
