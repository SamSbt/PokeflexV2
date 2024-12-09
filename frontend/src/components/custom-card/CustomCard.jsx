import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./custom-card.scss";

function CustomCard({ to, name, img_src, type }) {
	return (
		<>
			<Card
				as={Link}
				to={to}
				className="text-decoration-none mb-4 cardStyle bg-dark text-light"
			>
				<div className="d-flex justify-content-center m-3">
					<Card.Img variant="top" src={img_src} alt={`Image du Pokéflon ${name}`} />
				</div>
				<Card.Body>
					<Card.Title>{name}</Card.Title>
					<Card.Subtitle className="my-3 text-light poppins-light small-text">
						Created by :
					</Card.Subtitle>
					{/* TODO : changer ici pour un created by - passer en props !!
					cmt connecter username au created by ? */}
					<hr />
					<Card.Text className="small-text">Type(s) : {type}</Card.Text>
				</Card.Body>
			</Card>
		</>
	);
}

// CustomCard.propTypes = {
// 	to: PropTypes.string.isRequired,
// 	name: PropTypes.string.isRequired,
// 	//sound: PropTypes.string.isRequired,
// 	// img_src: PropTypes.string.isRequired,
// 	types: PropTypes.string.isRequired,
// };

export default CustomCard;
