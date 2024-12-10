import express from "express";
import multer from "multer";
import {
	deletePokeflon,
	getOnePokeflon,
	getPokeflons,
	postPokeflon,
	putPokeflon,
} from "../controllers/Pokeflon.controller.js";
import { upload } from "../middlewares/multerMiddleware.js";

// const upload = multer({ dest: "uploads/" });
const router = express.Router();

//app.get("/", (req, res) => {
// router.get("/", (req, res) => {
// 	res.send("Server is ready");
// });

router.get("/", getPokeflons);
router.get("/:id", getOnePokeflon);
router.post("/", upload.single("file"), postPokeflon);
router.put("/:id", putPokeflon);
router.delete("/:id", deletePokeflon);

export default router;
