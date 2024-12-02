import express from "express";

const router = express.Router();

//app.get("/", (req, res) => {
router.get("/", (req, res) => {
	res.send("Server is ready");
});

// router.get("/", getPokeflon);
// router.post("/", postPokeflon);
// router.put("/:id", putPokeflon);
// router.delete("/:id", deletePokeflon);

export default router;
