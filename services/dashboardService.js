import pool from "../config/database.js";

export const getStats = async () => {
  const totalBookings = await pool.query(
    "SELECT COUNT(*) FROM bookings"
  );

 const totalRevenueResult =
  await pool.query(`

    SELECT

      COALESCE(
        SUM(b.total_price),
        0
      ) AS total

    FROM bookings b

    JOIN payments p
    ON b.booking_id = p.booking_id

    WHERE
    p.payment_status = 'paid'

  `);

  const statusStats = await pool.query(`
    SELECT status, COUNT(*) 
    FROM bookings 
    GROUP BY status
  `);
   const totalTour= await pool.query(
    "SELECT COUNT(*) FROM tours"
   ); 
    const recentBookingsResult =
      await pool.query(`
        SELECT
          b.booking_id,
          b.full_name,
          b.people_count,
          b.total_price,
          b.status,
          t.title AS tour_title
        FROM bookings b

        JOIN tours t
        ON b.tour_id = t.tour_id

        ORDER BY b.booking_id DESC

        LIMIT 5
      `);
      const monthlyBookingsResult =
      await pool.query(`
        SELECT

          TO_CHAR(
            booking_date,
            'Mon'
          ) AS month,

          COUNT(*)::int AS count

        FROM bookings

        GROUP BY
          month,
          EXTRACT(
            MONTH FROM booking_date
          )

        ORDER BY
          EXTRACT(
            MONTH FROM booking_date
          )
      `);
  return {
    totalBookings: totalBookings.rows[0].count,
    totalTour: totalTour.rows[0].count,
    totalRevenue:parseFloat(totalRevenueResult.rows[0].total),
    statusStats: statusStats.rows,
    recentBookings:recentBookingsResult.rows,
    monthlyBookings:monthlyBookingsResult.rows,
  };
  
};
