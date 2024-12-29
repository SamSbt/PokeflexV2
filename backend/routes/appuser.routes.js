import express from "express";
import {
	deleteAppUser,
	getOneAppUser,
	getAppUsers,
	postAppUser,
	putAppUser,
} from "../controllers/AppUser.controller.js";
import { authenticate, hasRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAppUsers);
router.get("/:id", getOneAppUser);
router.post("/", postAppUser);

router.use(authenticate);
router.use(hasRole("Dresseur"));

router.put("/:id", putAppUser);
router.delete("/:id", deleteAppUser);

export default router;
