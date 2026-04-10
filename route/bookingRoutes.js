import express from "express";
import {
  createBooking,
  getBookings,
  approveBooking,
  rejectBooking
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User books tour
router.post("/", protect, createBooking);

// Admin only
router.get("/", protect, isAdmin, getBookings);

router.put("/:id/approve", protect, isAdmin, approveBooking);
router.put("/:id/reject", protect, isAdmin, rejectBooking);

export default router;