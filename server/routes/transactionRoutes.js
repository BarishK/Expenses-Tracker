import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getTransactions);
router.post("/", authenticateToken, addTransaction);
router.delete("/delete/:id", authenticateToken, deleteTransaction);

export default router;
