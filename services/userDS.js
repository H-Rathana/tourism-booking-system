import pool from "../config/database.js";

export const getHomeStatsService = async () => {

  // Total Bookings
  const bookingsResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM bookings
  `);

  // Total Tours
  const toursResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM tours
  `);

  // Completed Bookings
  const completedResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM bookings
    WHERE status = 'completed'
  `);
  // Total Users
  const usersResult = await pool.query(`
    SELECT COUNT(*) AS total
    FROM users
    WHERE role = 'customer'
`);

const totalUsers = Number(
    usersResult.rows[0].total
);
  const totalBookings = Number(
    bookingsResult.rows[0].total
  );

  const totalTours = Number(
    toursResult.rows[0].total
  );

  const completedBookings = Number(
    completedResult.rows[0].total
  );

  const happyTravelers =
    totalBookings === 0
      ? 0
      : Math.round(
          (completedBookings / totalBookings) * 100
        );

  return {

  totalBookings,

  totalTours,

  totalUsers,

  completedBookings,

  happyTravelers,

};

};