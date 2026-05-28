import pool from "../config/database.js";

// ✅ GET ALL USERS
export const getAllUsers =
  async () => {

    const result =
      await pool.query(`

        SELECT
          user_id,
          name,
          email,
          role,
          created_at

        FROM users

        ORDER BY
        user_id DESC

      `);

    return result.rows;

};