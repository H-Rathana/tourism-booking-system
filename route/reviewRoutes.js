import express from "express";

import {
  createReview,
  getTourReviews,
  getAllReviews,
  deleteReview,
  updateReview,
  deleteOwnReview,
}
from "../controllers/reviewController.js";

import {
  protect
}
from "../middleware/authMiddleware.js";

import {
  isAdmin
}
from "../middleware/roleMiddleware.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  createReview
);

router.get(
  "/tour/:tourId",
  getTourReviews
);

router.get(
  "/admin",
  protect,
  isAdmin,
  getAllReviews
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteReview
);

router.put(
  "/mine/:id",
  protect,
  updateReview
);

router.delete(
  "/mine/:id",
  protect,
  deleteOwnReview
);

export default router;