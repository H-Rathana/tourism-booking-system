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

//Delete Tour
// export const deleteTourService = async (id) => {
//   // const result = await pool.query(
//   //   "DELETE FROM tours WHERE id=$1 RETURNING *",
//   //   [id]
//     await pool.query(`DELETE FROM tours WHERE id = $1`, [id]);
//   return result.rows[0]; // ✅ only return data
// };
export const deleteTourService = async (id) => {
  await pool.query(`DELETE FROM tours WHERE tour_id = $1`, [id]);
};