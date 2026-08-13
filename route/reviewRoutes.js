import express from "express";

import {
  createReview,
  getTourReviews,
  getAllReviews,
  deleteReview,
  updateReview,
  deleteOwnReview,
  getHomeReviewsController,
}
from "../controllers/reviewController.js";

import {
  protect
}
from "../middleware/authMiddleware.js";

// import {
//   isAdmin
// }
// from "../middleware/roleMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router =
  express.Router();

router.post("/",protect,createReview);

router.get("/tour/:tourId",getTourReviews);

router.get("/admin",protect,authorize("admin", "SUPER_ADMIN"),getAllReviews);

router.delete("/:id",protect,authorize("admin", "SUPER_ADMIN"),deleteReview);

router.put("/mine/:id",protect,updateReview);

router.delete("/mine/:id",protect,deleteOwnReview);
router.get("/home",getHomeReviewsController);

export default router;