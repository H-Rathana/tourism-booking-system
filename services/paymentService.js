import pool from "../config/database.js";

// ✅ GET ALL PAYMENTS
export const getAllPayments =
  async () => {

    const result =
      await pool.query(`

        SELECT

          p.payments_id,
          p.booking_id,
          p.amount,
          p.payment_method,
          p.payment_status,
          p.payment_date,

          b.full_name,
          b.phone,

          t.title AS tour_title

        FROM payments p

        JOIN bookings b
        ON p.booking_id = b.booking_id

        JOIN tours t
        ON b.tour_id = t.tour_id

        ORDER BY
        p.payments_id DESC

      `);

    return result.rows;

};