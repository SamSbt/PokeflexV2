import express from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import Pokeflon from "../models/Pokeflon.model.js";


const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
	try {
		const { file } = req;
		if (!file) {
			return res
				.status(400)
				.json({ success: false, message: "No file uploaded" });
		}

		// Stocker l'URL ou chemin du fichier dans la base de données
		const pokeflon = new Pokeflon({
			...req.body,
			img_src: `/uploads/${file.filename}`,
		});
		await pokeflon.save();

		res.status(201).json({ success: true, data: pokeflon });
	} catch (error) {
		console.error("Error in uploading file:", error.message);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

export default router;
