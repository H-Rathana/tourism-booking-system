import pool from "../config/database.js";


//View all Tour From Database
export const getAllTours = async () => {
  const result = await pool.query("SELECT * FROM tours");
  return result.rows;
};

//Create Tour
export const createTour = async ({ title,description, location, price,max_people, image }) => {
  const result = await pool.query(
    `INSERT INTO tours (title,description, location, price,duration,max_people, image)
     VALUES ($1, $2, $3, $4,$5,$6,$7)
     RETURNING *`,
    [title,description, location, price,duration,max_people, image]
  );

  return result.rows[0];
};

//Update Tour
export const updateTourService = async (id, data) => {
  const { title,description, location, price,duration,max_people, image } = data;

  const result = await pool.query(
    `UPDATE tours
     SET title = $1,
         description=$2,
         location = $3,
         price = $4,
         duration=$5,
         max_people=$6,
         image = COALESCE($7, image)
     WHERE tour_id = $8
     RETURNING *`,
    [title,description, location, price,duration,max_people, image, id]
  );

  return result.rows[0];
};

export const deleteTourService = async (id) => {
  await pool.query(`DELETE FROM tours WHERE tour_id = $1`, [id]);
};

export const getPopularTours = async () => {

  const result = await pool.query(`
    SELECT
      t.*,
      COUNT(b.booking_id)::int AS bookings
    FROM tours t
    LEFT JOIN bookings b
      ON t.tour_id = b.tour_id
    GROUP BY t.tour_id
    ORDER BY bookings DESC
    LIMIT 3
  `);

  return result.rows;
};
export const getTourStats = async () => {

    const result = await pool.query(`
        SELECT
            COUNT(*) AS total_tours,
            COUNT(DISTINCT location) AS destinations
        FROM tours
    `);

    const bookingResult = await pool.query(`
        SELECT COUNT(*) AS travelers
        FROM bookings
        WHERE status='completed'
    `);

    const reviewResult = await pool.query(`
        SELECT
            ROUND(AVG(rating),1) AS average_rating
        FROM reviews
    `);

    return {
        totalTours: Number(result.rows[0].total_tours),
        destinations: Number(result.rows[0].destinations),
        travelers: Number(bookingResult.rows[0].travelers),
        averageRating:
            Number(reviewResult.rows[0].average_rating || 0)
    };
};