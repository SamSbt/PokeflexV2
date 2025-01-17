import express from "express";
import {
	deleteType,
	getOneType,
	getTypes,
	postType,
	putType,
} from "../controllers/Type.controller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getTypes);
router.get("/:id", getOneType);

router.use(authenticate);
router.use(hasRole("Admin"));

router.post("/", postType);
router.put("/:id", putType);
router.delete("/:id", deleteType);

export default router;
