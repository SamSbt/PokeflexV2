import multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads"); // Dossier où les fichiers seront sauvegardés
	},
	filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
		cb(null, Date.now() + extname);
	},
});

export const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		// Autoriser uniquement les fichiers image
		if (!file.mimetype.match(/image\/(jpeg|png|gif)/)) {
			return cb(new Error("Only JPG, PNG, and GIF files are allowed"), false);
		}
		cb(null, true);
	},
});
