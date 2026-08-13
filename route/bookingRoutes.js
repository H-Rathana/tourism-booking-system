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
// import { isAdmin } from "../middleware/roleMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User books tour
router.post("/", protect, createBooking);
router.get("/ticket/:id",protect,getTicket);
router.get("/my-bookings",protect,getMyBookings);

router.put("/:id/checkin",protect,authorize("admin", "SUPER_ADMIN"),checkInBooking);
router.get("/checkedin/history",protect, authorize("admin", "SUPER_ADMIN"),getCheckedInHistory);
// Admin only
router.get("/", protect, authorize("admin", "SUPER_ADMIN"), getBookings);

router.put("/:id/approve", protect, authorize("admin", "SUPER_ADMIN"), approveBooking);
router.put("/:id/reject", protect, authorize("admin", "SUPER_ADMIN"), rejectBooking);

router.get("/user/:id",protect,authorize("admin", "SUPER_ADMIN"),getUserBookings);

export default router;