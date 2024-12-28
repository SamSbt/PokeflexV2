import express from "express";

import {
	deletePokeflon,
	getOnePokeflon,
	getPokeflonByIdType,
	getPokeflons,
	postPokeflon,
	putPokeflon,
} from "../controllers/Pokeflon.controller.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getPokeflons);
router.get("/:id", getOnePokeflon);
router.get("/by-type/:id", getPokeflonByIdType);
router.post("/", authenticate, hasRole("Dresseur"), upload.single("file"), postPokeflon);
router.put("/:id", authenticate, hasRole("Dresseur"), putPokeflon);
router.delete("/:id", authenticate, hasRole("Dresseur"), deletePokeflon);

export default router;
