import pool from "../config/database.js";


//View all Tour From Database
export const getAllTours = async () => {
  const result = await pool.query("SELECT * FROM tours");
  return result.rows;
};

//Create Tour
export const createTour = async ({ title, location, price, image }) => {
  const result = await pool.query(
    `INSERT INTO tours (title, location, price, image)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, location, price, image]
  );

  return result.rows[0];
};

//Update Tour
export const updateTourService = async (id, data) => {
  const { title, location, price, image } = data;

  const result = await pool.query(
    `UPDATE tours
     SET title = $1,
         location = $2,
         price = $3,
         image = COALESCE($4, image)
     WHERE id = $5
     RETURNING *`,
    [title, location, price, image, id]
  );

  return result.rows[0];
};

//Delete Tour
// export const deleteTourService = async (id) => {
//   // const result = await pool.query(
//   //   "DELETE FROM tours WHERE id=$1 RETURNING *",
//   //   [id]
//     await pool.query(`DELETE FROM tours WHERE id = $1`, [id]);
//   return result.rows[0]; // ✅ only return data
// };
export const deleteTourService = async (id) => {
  await pool.query(`DELETE FROM tours WHERE id = $1`, [id]);
};