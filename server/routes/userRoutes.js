import express from "express";
import {
  deleteAccount,
  getUser,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getUser);
router.put("/", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, updatePassword);
router.delete("/", authenticateToken, deleteAccount);

export default router;
