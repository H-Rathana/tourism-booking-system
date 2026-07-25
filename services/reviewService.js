import pool from "../config/database.js";

export const createReview = async (
  userId,
  tourId,
  bookingId,
  rating,
  comment
) => {

  const result =
    await pool.query(
      `
      INSERT INTO reviews
      (
        user_id,
        tour_id,
        booking_id,
        rating,
        comment
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
      `,
      [
        userId,
        tourId,
        bookingId,
        rating,
        comment
      ]
    );
    

  return result.rows[0];
};
export const getTourReviews =
  async (tourId) => {

    const result =
      await pool.query(
        `
        SELECT
          r.*,
          u.name,
          u.profile_image
        FROM reviews r
        JOIN users u
        ON r.user_id=u.user_id
        WHERE r.tour_id=$1
        ORDER BY r.created_at DESC
        `,
        [tourId]
      );

    return result.rows;
};
export const getTourRating =
  async (tourId) => {

    const result =
      await pool.query(
        `
        SELECT
          ROUND(
            AVG(rating),
            1
          ) AS average_rating,

          COUNT(*)
          AS total_reviews

        FROM reviews
        WHERE tour_id=$1
        `,
        [tourId]
      );

    return result.rows[0];
};
export const getAllReviews =
  async () => {

    const result =
      await pool.query(`
        SELECT
          r.review_id,
          r.rating,
          r.comment,
          r.created_at,
          u.name,
          u.profile_image,
          t.title

        FROM reviews r

        JOIN users u
          ON r.user_id = u.user_id

        JOIN tours t
          ON r.tour_id = t.tour_id

        ORDER BY r.created_at DESC
      `);

    return result.rows;
};
export const deleteReview =
  async (reviewId) => {

    await pool.query(
      `
      DELETE FROM reviews
      WHERE review_id=$1
      `,
      [reviewId]
    );
};
export const canReview =
  async (
    userId,
    tourId
  ) => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM bookings
        WHERE
          user_id = $1
          AND tour_id = $2
          AND status = 'completed'
        LIMIT 1
        `,
        [
          userId,
          tourId
        ]
      );

    return result.rows.length > 0;

};
export const hasReviewed =
  async (
    userId,
    tourId
  ) => {

    const result =
      await pool.query(
        `
        SELECT review_id
        FROM reviews
        WHERE
          user_id = $1
          AND tour_id = $2
        LIMIT 1
        `,
        [
          userId,
          tourId
        ]
      );

    return result.rows.length > 0;

};

export const updateReview =
  async (
    reviewId,
    userId,
    rating,
    comment
  ) => {

    const result =
      await pool.query(
        `
        UPDATE reviews
        SET
          rating = $1,
          comment = $2
        WHERE
          review_id = $3
          AND user_id = $4
        RETURNING *
        `,
        [
          rating,
          comment,
          reviewId,
          userId,
        ]
      );

    return result.rows[0];

};

export const deleteOwnReview =
  async (
    reviewId,
    userId
  ) => {

    await pool.query(
      `
      DELETE FROM reviews
      WHERE
        review_id = $1
        AND user_id = $2
      `,
      [
        reviewId,
        userId,
      ]
    );

};

export const getHomeReviews = async () => {

  const result = await pool.query(`
    SELECT

      r.review_id,
      r.rating,
      r.comment,
      r.created_at,

      u.name,
      profile_image,

      t.title

    FROM reviews r

    JOIN users u
      ON r.user_id = u.user_id

    JOIN tours t
      ON r.tour_id = t.tour_id

    ORDER BY r.created_at DESC

    LIMIT 3
  `);

  return result.rows;

};