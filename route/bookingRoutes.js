import express from "express";
import {
  createBooking,
  getBookings,
  approveBooking,
  rejectBooking,
  getTicket,
  checkInBooking,
  getCheckedInHistory,
  getMyBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User books tour
router.post("/", protect, createBooking);
router.get("/ticket/:id",protect,getTicket);
router.get("/my-bookings",protect,getMyBookings);

router.put("/:id/checkin",protect,isAdmin,checkInBooking);
router.get("/checkedin/history",protect, isAdmin,getCheckedInHistory);
// Admin only
router.get("/", protect, isAdmin, getBookings);

router.put("/:id/approve", protect, isAdmin, approveBooking);
router.put("/:id/reject", protect, isAdmin, rejectBooking);

router.get("/user/:id",protect,isAdmin,getUserBookings);

export default router;