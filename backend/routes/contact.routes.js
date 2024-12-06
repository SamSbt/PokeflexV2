import express from "express";
import {
	deleteContact,
	getContacts,
	postContact,
} from "../controllers/Contact.controller.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, isAdmin, getContacts);
router.post("/", postContact);
router.delete("/:id", authenticate, isAdmin, deleteContact);

export default router;
