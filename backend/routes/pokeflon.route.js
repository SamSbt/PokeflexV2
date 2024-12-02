import express from "express";
import { deletedPokeflon, getPokeflon, postPokeflon, putPokeflon } from "../controllers/Pokeflon.controller.js";

const router = express.Router();

//app.get("/", (req, res) => {
// router.get("/", (req, res) => {
// 	res.send("Server is ready");
// });

router.get("/", getPokeflon);
router.post("/", postPokeflon);
router.put("/:id", putPokeflon);
router.delete("/:id", deletedPokeflon);

export default router;
