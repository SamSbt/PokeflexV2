import { Button } from "react-bootstrap";

import "./custom-button.scss";

const CustomButton = ({ text, icon, type, className, onClick, disabled }) => {
	return (
		<>
			<Button
				className={`btn ${className} border border-light`}
				type={type}
				onClick={onClick}
				disabled={disabled}
			>
				{icon ? <i className={icon}></i> : text}
			</Button>
		</>
	);
};

export default CustomButton;

// style btn rouge : btn-red
// style btn noir : bg-black
