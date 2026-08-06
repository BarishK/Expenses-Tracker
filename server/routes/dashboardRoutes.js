import express from "express";
import { getDashboardCharts } from "../controllers/dashboardController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-charts", authenticateToken, getDashboardCharts);

export default router;
