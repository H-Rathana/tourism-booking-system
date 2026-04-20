import pool from "../config/database.js";

export const getStats = async () => {
  const totalBookings = await pool.query(
    "SELECT COUNT(*) FROM bookings"
  );

  const totalRevenue = await pool.query(
    "SELECT COALESCE(SUM(total_price),0) FROM bookings WHERE status='Confirmed'"
  );

  const statusStats = await pool.query(`
    SELECT status, COUNT(*) 
    FROM bookings 
    GROUP BY status
  `);
   const totalTour= await pool.query(
    "SELECT COUNT(*) FROM tours"
   ); 
  return {
    totalBookings: totalBookings.rows[0].count,
    totalTour: totalTour.rows[0].count,
    totalRevenue: totalRevenue.rows[0].coalesce,
    statusStats: statusStats.rows
  };
};