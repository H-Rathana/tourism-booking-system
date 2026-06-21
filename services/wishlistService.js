import pool from "../config/database.js";

// Add wishlist
export const addToWishlist =
  async (userId, tourId) => {

    const result =
      await pool.query(

        `
        INSERT INTO wishlist
        (
          user_id,
          tour_id
        )
        VALUES ($1,$2)

        ON CONFLICT
        (user_id,tour_id)

        DO NOTHING

        RETURNING *
        `,
        [userId, tourId]

      );

    return result.rows[0];

};

// Get user wishlist
export const getWishlist =
  async (userId) => {

    const result =
      await pool.query(

        `
        SELECT

          w.wishlist_id,

          t.tour_id,
          t.title,
          t.price,
          t.location,
          t.image

        FROM wishlist w

        JOIN tours t
        ON w.tour_id=t.tour_id

        WHERE w.user_id=$1

        ORDER BY
        w.created_at DESC
        `,

        [userId]

      );

    return result.rows;

};

// Remove wishlist
export const removeWishlist =
  async (
    userId,
    tourId
  ) => {

    await pool.query(

      `
      DELETE FROM wishlist
      WHERE user_id=$1
      AND tour_id=$2
      `,

      [userId, tourId]

    );

  };