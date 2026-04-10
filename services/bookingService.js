import pool from "../config/database.js";

export const createBooking = async (userId, data) => {
  const { tour_id, people_count, total_price } = data;

  const result = await pool.query(
    `INSERT INTO bookings 
     (user_id, tour_id, booking_date, people_count, total_price) 
     VALUES ($1, $2, CURRENT_DATE, $3, $4) 
     RETURNING *`,
    [userId, tour_id, people_count, total_price]
  );

  return result.rows[0];
};

export const getAllBookings = async () => {
  const result = await pool.query(`
    SELECT b.*, u.name AS user_name, t.title AS tour_title
    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN tours t ON b.tour_id = t.tour_id
    ORDER BY b.booking_id DESC
  `);

  return result.rows;
};

export const updateBookingStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE bookings 
     SET status=$1 
     WHERE booking_id=$2 
     RETURNING *`,
    [status, id]
  );

  return result.rows[0];
};
