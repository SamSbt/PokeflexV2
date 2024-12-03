import express from "express";
import {
	deleteAppUser,
	getOneAppUser,
	getAppUser,
	postAppUser,
	putAppUser,
} from "../controllers/AppUser.controller.js";

const router = express.Router();

router.get("/", getAppUser);
router.get("/:id", getOneAppUser);
router.post("/", postAppUser);
router.put("/:id", putAppUser);
router.delete("/:id", deleteAppUser);

export default router;
