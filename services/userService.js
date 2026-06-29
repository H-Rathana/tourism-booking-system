import pool from "../config/database.js";

// ✅ GET ALL USERS
// export const getAllUsers =
//   async () => {

//     const result =
//       await pool.query(`

//         SELECT
//           user_id,
//           name,
//           email,
//           role,
//           created_at

//         FROM users

//         ORDER BY
//         user_id DESC

//       `);

//     return result.rows;

// };

export const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      u.profile_image,
      COUNT(b.booking_id) AS total_bookings
    FROM users u
    LEFT JOIN bookings b
      ON u.user_id = b.user_id
    GROUP BY
      u.user_id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      u.profile_image
    ORDER BY u.user_id DESC
  `);

  return result.rows;
};

export const getProfile = async (
  userId
) => {

  const result =
    await pool.query(
      `
      SELECT
        user_id,
        name,
        email,
        phone,
        profile_image
      FROM users
      WHERE user_id = $1
      `,
      [userId]
    );

  return result.rows[0];

};
export const updateProfile =
  async (
    userId,
    name,
    email,
    phone
  ) => {

   const result =
  await pool.query(
    `
    UPDATE users
    SET
      name = $1,
      email = $2,
      phone = $3
    WHERE user_id = $4

    RETURNING
      user_id,
      name,
      email,
      phone,
      profile_image
    `,
    [
      name,
      email,
      phone,
      userId
    ]
  );

    return result.rows[0];

};
export const updateProfileImage =
  async (
    userId,
    image
  ) => {

    const result =
      await pool.query(
        `
        UPDATE users
        SET profile_image = $1
        WHERE user_id = $2

        RETURNING
          user_id,
          name,
          email,
          phone,
          profile_image
        `,
        [
          image,
          userId
        ]
      );

    return result.rows[0];

};

export const getUserById =
  async (userId) => {

    const result =
      await pool.query(
        `
        SELECT
          user_id,
          name,
          email,
          role,
          profile_image,
          created_at
        FROM users
        WHERE user_id = $1
        `,
        [userId]
      );

    return result.rows[0];
};