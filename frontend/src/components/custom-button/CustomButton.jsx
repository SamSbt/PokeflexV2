import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import "./custom-button.scss";

const CustomButton = ({
	text = "",
	type = "button",
	className = "",
	onClick,
	disabled = false,
}) => {
	return (
		<>
			<Button
				className={`btn ${className} border border-light`}
				type={type}
				onClick={onClick}
				disabled={disabled}
			>
				{text}
			</Button>
		</>
	);
};

CustomButton.propTypes = {
	text: PropTypes.string,
	type: PropTypes.string,
	className: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
};

export default CustomButton;

// style btn rouge : btn-red
// style btn noir : bg-black
