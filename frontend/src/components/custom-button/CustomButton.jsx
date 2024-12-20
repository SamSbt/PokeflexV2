import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

import "./custom-button.scss";

const CustomButton = ({
	text = "",
	type = "button",
	className = "",
	onClick,
	variant, 
	size,
	disabled = false,
}) => {
	return (
		<>
			<Button
				className={`btn ${className} border border-white`}
				variant={variant}
				size={size}
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
	type: PropTypes.oneOf(["button", "submit", "reset"]),
	className: PropTypes.string, 
	onClick: PropTypes.func, 
	variant: PropTypes.oneOf([
		"primary",
		"secondary",
		"success",
		"danger",
		"warning",
		"info",
		"light",
		"dark",
		"link", 
	]), 
	size: PropTypes.oneOf(["sm", "lg"]),
	disabled: PropTypes.bool, 
};

export default CustomButton;

// style btn rouge : btn-red
// style btn noir : btn-black
