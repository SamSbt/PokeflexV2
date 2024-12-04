import express from "express";
import {
	deleteContact,
	getContact,
	postContact,
} from "../controllers/Type.controller.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, isAdmin, getContact);
router.post("/", postContact);
router.delete("/:id", authenticate, isAdmin, deleteContact);

export default router;
