import multer from "multer";
import path from "path";
import sizeOf from "image-size";

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
			// autoriser only fichiers image
			if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
				return cb(
					new Error("Seuls les fichiers JPG, PNG, et GIF sont autorisés."),
					false
				);
			}
			// vérif supplémentaire de l'image avec image-size
			const dimensions = sizeOf(file.buffer); // Vérifier les dimensions de l'image
			if (!dimensions || dimensions.width === 0 || dimensions.height === 0) {
				return cb(new Error("Contenu de l'image invalide."), false);
			}

			cb(null, true); // fichier valide
		} catch (err) {
			cb(
				new Error("Erreur lors du traitement du fichier : " + err.message),
				false
			);
		}
	},
});
