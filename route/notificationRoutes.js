import express from "express";

import {
  getNotifications,
  readNotification
}
from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get(
  "/",
  protect,
  getNotifications
);

router.patch(
  "/:id/read",
  protect,
  readNotification
);

export default router;