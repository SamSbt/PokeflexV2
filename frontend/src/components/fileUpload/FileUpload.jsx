import React, { useState, useRef } from "react";
import { Col, Image, Row } from "react-bootstrap";

import CustomButton from "../custom-button/CustomButton";

import "./file-upload.scss";

const MAX_MB_SIZE = 1;

const FileUpload = ({ controlId }) => {
	const [file, setFile] = useState(null);
	const [previewSrc, setPreviewSrc] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const fileInputRef = useRef(null);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];

		if (!selectedFile) return;

		// validation type fichier
		if (!selectedFile.type.match(/image\/(jpeg|png|gif)/)) {
			setErrorMessage(
				"Seuls les fichiers JPG, JPEG, PNG et GIF sont autorisés."
			);
			setFile(null);
			setPreviewSrc("");
			return;
		}

		// validation taille fichier
		if (selectedFile.size > MAX_MB_SIZE * 1024 * 1024) {
			setErrorMessage(`La taille du fichier dépasse ${MAX_MB_SIZE} MB.`);
			setFile(null);
			setPreviewSrc("");
			return;
		}

		// Si tout va bien, on définit le fichier et crée un aperçu
		setFile(selectedFile);
		setErrorMessage("");

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewSrc(reader.result);
		};
		reader.readAsDataURL(selectedFile);
	};

	const handleRemoveFile = () => {
		setFile(null);
		setPreviewSrc("");
		setErrorMessage("");
	};

	const handleButtonClick = () => {
		fileInputRef.current.click(); // Simule le clic sur l'input
	};

	return (
		<div className="m-3">
			<div className="mb-3">
				<label className="d-flex flex-column align-items-center">
					<CustomButton
						className="btn-red file-upload-btn d-flex align-items-center justify-content-center"
						text="Parcourir"
						onClick={handleButtonClick}
					/>

					{previewSrc && (
						<div className="file-preview mt-3">
							<Image src={previewSrc} className="img-thumbnail" />
							<CustomButton
								text="X"
								variant="danger"
								size="sm"
								onClick={handleRemoveFile}
								className="mt-2"
							>
								&times;
							</CustomButton>
						</div>
					)}

					{errorMessage && (
						<div className="text-danger mt-2">{errorMessage}</div>
					)}
					<Row className="d-flex justify-content-start smaller-text">
						<Col xs={12}>
						<p className="mt-3 mb-1">
							- Formats d'image acceptés: JPG, JPEG, PNG et GIF.
						</p></Col>
						<Col xs={12}><p className="my-2">- Taille maximale du fichier: 1 MB.</p></Col>
						<Col xs={12}><p>- Si l'image est trop grande, elle sera centrée.</p></Col>
					</Row>
				</label>
				<input
					type="file"
					onChange={handleFileChange}
					accept="image/*"
					ref={fileInputRef}
					id={controlId}
					className="hidden-file-input"
				/>
			</div>
		</div>
	);
};

export default FileUpload;

// code récupéré et modifié de https://jsfiddle.net/goncalvesjoao/0t3j2gpz/
