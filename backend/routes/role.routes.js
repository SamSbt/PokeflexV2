import express from "express";
import {
	deleteRole,
	getOneRole,
	getRoles,
	postRole,
	putRole,
} from "../controllers/Role.controller.js";

const router = express.Router();

router.get("/", getRoles);
router.get("/:id", getOneRole);
router.post("/", postRole);
router.put("/:id", putRole);
router.delete("/:id", deleteRole);

export default router;
