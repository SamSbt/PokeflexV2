// connecté avec fichier middlewares/authMiddleware.js & controllers/userController.js

import express from "express";
import { putUserRole } from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route protégée pour modifier le rôle d'un utilisateur, accessible uniquement aux admins
router.put("/update-role", authenticate, isAdmin, putUserRole);

export default router;
