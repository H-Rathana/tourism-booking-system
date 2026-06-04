import pool from "../config/database.js";

export const createNotification = async (
  userId,
  bookingId,
  message
) => {

  const result = await pool.query(
    `
    INSERT INTO notifications (
      user_id,
      booking_id,
      message
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [
      userId,
      bookingId,
      message
    ]
  );

  return result.rows[0];
};

export const getUserNotifications =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
      );

    return result.rows;
};

export const markAsRead =
  async (notificationId) => {

    await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE notification_id = $1
      `,
      [notificationId]
    );
};