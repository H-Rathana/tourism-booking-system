import * as reviewService
from "../services/reviewService.js";

export const createReview =
  async (req, res, next) => {

    try {

      const {
        tour_id,
        booking_id,
        rating,
        comment
      } = req.body;
      const canReview =
        await reviewService.canReview(
            req.user.id,
            tour_id
        );

        if (!canReview) {

        return res.status(403).json({
            message:
            "You can only review tours you have completed."
        });

        }
        const alreadyReviewed =
            await reviewService.hasReviewed(
                req.user.id,
                tour_id
            );

            if (alreadyReviewed) {

            return res.status(400).json({
                message:
                "You already reviewed this tour."
            });

            }
      const review =
        await reviewService.createReview(
          req.user.id,
          tour_id,
          booking_id,
          rating,
          comment
        );

      res.status(201).json(
        review
      );

    } catch (error) {

      next(error);

    }

};
export const getTourReviews =
  async (req, res, next) => {

    try {

      const reviews =
        await reviewService.getTourReviews(
          req.params.tourId
        );

      const rating =
        await reviewService.getTourRating(
          req.params.tourId
        );

      res.json({
        reviews,
        rating
      });

    } catch (error) {

      next(error);

    }

};
export const getAllReviews =
  async (req, res, next) => {

    try {

      const reviews =
        await reviewService.getAllReviews();

      res.json(reviews);

    } catch (error) {

      next(error);

    }

};
export const deleteReview =
  async (req, res, next) => {

    try {

      await reviewService.deleteReview(
        req.params.id
      );

      res.json({
        message:
          "Review deleted"
      });

    } catch (error) {

      next(error);

    }

};
export const updateReview =
  async (req, res, next) => {

    try {

      const {
        rating,
        comment,
      } = req.body;

      const review =
        await reviewService.updateReview(
          req.params.id,
          req.user.id,
          rating,
          comment
        );

      res.json(review);

    } catch (error) {

      next(error);

    }

};
export const deleteOwnReview =
  async (req, res, next) => {

    try {

      await reviewService.deleteOwnReview(
        req.params.id,
        req.user.id
      );

      res.json({
        message:
          "Review deleted"
      });

    } catch (error) {

      next(error);

    }

};
export const getHomeReviewsController = async (req, res) => {

  try {

    const reviews =
      await reviewService.getHomeReviews();

    res.json(reviews);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};