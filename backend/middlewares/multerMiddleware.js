import fs from "fs";
import sizeOf from "image-size";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads"); // Dossier où les fichiers seront sauvegardés
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const extname = path.extname(file.originalname);
		const finalFilename = uniqueSuffix + extname;
		cb(null, finalFilename);
	},
});

export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		try {
			// autoriser seulement les fichiers image
			if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
				return cb(
					new Error("Seuls les fichiers JPG, PNG, et GIF sont autorisés."),
					false
				);
			}

			// vérification supp img avec image-size
			// callback pr gérer le fichier après qu'il soit save
			cb(null, true);
		} catch (err) {
			cb(
				new Error("Erreur lors du traitement du fichier : " + err.message),
				false
			);
		}
	},
});

// vérif dimensions img après dl
export const checkImageDimensions = (filePath) => {
	return new Promise((resolve, reject) => {
		sizeOf(filePath, (err, dimensions) => {
			if (err) {
				fs.unlink(filePath, () => {}); // suppr fichier si erreur
				reject(
					new Error("Erreur lors de la vérification des dimensions de l'image.")
				);
			} else if (
				!dimensions ||
				dimensions.width === 0 ||
				dimensions.height === 0
			) {
				fs.unlink(filePath, () => {}); // suppr fichier si wrong dim
				reject(new Error("Contenu de l'image invalide."));
			} else {
				resolve(true);
			}
		});
	});
};
