import express from "express";
import {
	associateTypesWithPokeflon,
	deleteTypesFromPokeflon,
	getTypesByPokeflon, 
	updateTypesForPokeflon,
} from "../controllers/Type_Pokeflon.controller";


const router = express.Router();

router.get("/:pokeflonId", getTypesByPokeflon);
router.post("/", associateTypesWithPokeflon);
router.put("/:pokeflonId", updateTypesForPokeflon);
router.delete("/", deleteTypesFromPokeflon);

export default router;
