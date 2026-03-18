import pool from "../config/database.js";


//View all Tour From Database
export const getAllTours = async () => {
  const result = await pool.query("SELECT * FROM tours");
  return result.rows;
};

//Create Tour
export const createTour = async (data) => {
  const { title, description, location, price } = data;

  const result = await pool.query(
    "INSERT INTO tours (title, description, location, price) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, description, location, price]
  );

  return result.rows[0];
};

//Update Tour
export const updateTour = async (id, data) => {
  const { title, description, location, price } = data;

  const result = await pool.query(
    `UPDATE tours 
     SET title=$1, description=$2, location=$3, price=$4 
     WHERE id=$5 
     RETURNING *`,
    [title, description, location, price, id]
  );

  return result.rows[0];
};

//Delete Tour
export const deleteTour = async (id) => {
  const result = await pool.query(
    "DELETE FROM tours WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0]; // ✅ only return data
};