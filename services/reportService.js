import pool from "../config/database.js";

export const getReportData = async () => {

  const totalRevenue =
    await pool.query(`
      SELECT
      COALESCE(
      SUM(amount),0
      ) AS revenue
      FROM payments
      WHERE payment_status='paid'
    `);

  const totalBookings =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
    `);

  const approved =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='approved'
    `);

  const pending =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='Pending'
    `);

  const rejected =
    await pool.query(`
      SELECT COUNT(*)
      FROM bookings
      WHERE status='rejected'
    `);
  const monthlyBookings = await pool.query(`
    SELECT
    TO_CHAR(created_at,'Mon') AS month,
    COUNT(*) AS bookings
    FROM bookings
    GROUP BY month,
    DATE_PART('month',created_at)
    ORDER BY DATE_PART('month',created_at)
    `);
    const recentTransactions =
        await pool.query(`
        SELECT
        b.booking_id,
        b.full_name,
        p.amount,
        p.payment_status,
        p.payment_date

        FROM payments p

        JOIN bookings b
        ON p.booking_id=b.booking_id

        ORDER BY p.payment_date DESC
        LIMIT 5
        `);
  return {

    totalRevenue:
      totalRevenue.rows[0].revenue,

    totalBookings:
      totalBookings.rows[0].count,

    approved:
      approved.rows[0].count,

    pending:
      pending.rows[0].count,

    rejected:
      rejected.rows[0].count,
    monthlyBookings:
    monthlyBookings.rows,
    recentTransactions:
    recentTransactions.rows
  };
};