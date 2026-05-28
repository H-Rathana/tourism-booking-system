import express from "express";

import {
  getPayments,
} from "../controllers/paymentController.js";

const router =
  express.Router();

// ✅ GET ALL PAYMENTS
router.get(
  "/",
  getPayments
);

export default router;