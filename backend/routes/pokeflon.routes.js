import express from "express";
import multer from "multer";
import {
	deletePokeflon,
	getOnePokeflon,
	getPokeflonByIdType,
	getPokeflons,
	postPokeflon,
	putPokeflon,
} from "../controllers/Pokeflon.controller.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { authenticate } from "../middlewares/authMiddleware.js";

// const upload = multer({ dest: "uploads/" });
const router = express.Router();

//app.get("/", (req, res) => {
// router.get("/", (req, res) => {
// 	res.send("Server is ready");
// });

router.get("/", getPokeflons);
router.get("/:id", getOnePokeflon);
router.get("/by-type/:id", getPokeflonByIdType);
router.post("/", authenticate, upload.single("file"), postPokeflon);
router.put("/:id", putPokeflon);
router.delete("/:id", deletePokeflon);

export default router;
