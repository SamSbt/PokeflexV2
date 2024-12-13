import express from "express";
import {
	deleteRole,
	getOneRole,
	getRoles,
	postRole,
	putRole,
} from "../controllers/Role.controller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);  // Tous les accès nécessitent d'abord l'authentification
router.use(hasRole("admin")); // Vérifiez que l'utilisateur est un admin avant de continuer


router.get("/", getRoles);
router.get("/:id", getOneRole);
router.post("/", postRole);
router.put("/:id", putRole);
router.delete("/:id", deleteRole);

export default router;
