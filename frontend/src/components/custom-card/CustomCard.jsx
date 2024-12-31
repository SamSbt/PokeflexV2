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
	size = "small",
}) {
	return (
		<>
			<Card
				as={Link}
				to={to}
				className={`text-decoration-none mb-4 cardStyle bg-dark text-light ${size}`}
			>
				<Card.Img
					variant="top"
					src={`http://localhost:5000/api/${img_src}`}
					alt={`Image du Pokéflon ${name}`}
					className="pokeflon-img m-3"
				/>
				<Card.Body>
					<Card.Title>{name}</Card.Title>
					<Card.Subtitle className="my-3 text-light poppins-light small-text">
						Créé par : {createdBy}
					</Card.Subtitle>
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
					{summary && (
						<Card.Text className="mt-3">Description : {summary}</Card.Text>
					)}
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
	size: PropTypes.oneOf(["small", "large"]),
};

export default CustomCard;
