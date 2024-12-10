import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads"); // Dossier où les fichiers seront sauvegardés
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const extname = path.extname(file.originalname);
		console.log("extname file as:", extname);
		const finalFilename = uniqueSuffix + extname;

		console.log("Saving file as:", finalFilename); // Ajout du log pour vérifier le nom du fichier
		cb(null, finalFilename);
	},
});

export const upload = multer({
	
	storage,
	fileFilter: (req, file, cb) => {
		// Autoriser uniquement les fichiers image
		if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
			console.log("coucou");
			return cb(new Error("Only JPG, PNG, and GIF files are allowed"), false);
		}
		cb(null, true);
	},
});
