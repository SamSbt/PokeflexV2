import express from "express";
import {
	deleteContact,
	getContacts,
	postContact,
} from "../controllers/Contact.controller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, hasRole("admin"), getContacts);
router.post("/", postContact);
router.delete("/:id", authenticate, hasRole("admin"), deleteContact);

export default router;
