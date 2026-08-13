import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
// import { isAdmin } from "../middleware/roleMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", protect, authorize("admin", "SUPER_ADMIN"), getDashboardStats);

export default router;