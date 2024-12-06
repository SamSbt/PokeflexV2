import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./custom-card.scss";

function CustomCard({ to, name, id, imgSrc, types }) {
	return (
		<>
			<Card
				as={Link}
				to={to}
				className="text-decoration-none mb-4 cardStyle bg-dark text-light"
			>
				<div className="d-flex justify-content-center m-3">
					<Card.Img variant="top" src={imgSrc} alt={`Image de ${name}`} />
				</div>
				<Card.Body>
					<Card.Title>{name}</Card.Title>
					<Card.Subtitle className="mb-3 text-light poppins-light">
						Id: {id}
					</Card.Subtitle>
					<hr />
					<Card.Text>Type: {types}</Card.Text>
				</Card.Body>
			</Card>
		</>
	);
}

CustomCard.propTypes = {
	to: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	imgSrc: PropTypes.string.isRequired,
	types: PropTypes.string.isRequired,
};

export default CustomCard;
