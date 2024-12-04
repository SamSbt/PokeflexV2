import { Row, Col } from "react-bootstrap";

import CustomButton from "../custom-button/CustomButton";

const CustomFilterButton = () => {
	const filterOptions = ["A-Z", "Z-A", "Récents", "Populaires"];

	return (
		<section>
			<Row className="justify-content-center align-items-center mt-2 w-100">
				<Col xs={12} md="auto" className="text-start">
					<p className="ms-4 me-md-3 mb-2">Trier par :</p>
				</Col>

				<Col
					xs={12}
					sm={12}
					md={8}
					className="d-flex flex-wrap justify-content-start"
				>
					{filterOptions.map((option, index) => (
						<Col
							key={index}
							xs={6} // mobile : 2 boutons par ligne
							sm={3} // Tablette : 2 boutons par ligne
							md={3} // desktop : 4 boutons par ligne
							className="text-center mb-2 d-inline-block"
						>
							<CustomButton text={option} className="btn-black" />
						</Col>
					))}
				</Col>
			</Row>
		</section>
	);
};

export default CustomFilterButton;
