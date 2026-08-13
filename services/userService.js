import pool from "../config/database.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  sendPasswordResetEmail
} from "./emailService.js";

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


export const promoteUser = async (userId) => {
  // Check if user exists
  const result = await pool.query(
    "SELECT user_id, role FROM users WHERE user_id = $1",
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    throw new Error("User is already an admin");
  }

  if (user.role === "SUPER_ADMIN") {
    throw new Error("Cannot promote a Super Admin");
  }

  const updated = await pool.query(
    `
      UPDATE users
      SET role = 'admin'
      WHERE user_id = $1
      RETURNING
        user_id,
        name,
        email,
        role
    `,
    [userId]
  );

  return updated.rows[0];
};
export const demoteUser = async (currentUserId, targetUserId) => {

  const result = await pool.query(
    `
    SELECT
      user_id,
      name,
      email,
      role
    FROM users
    WHERE user_id = $1
    `,
    [targetUserId]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  // Prevent demoting yourself
  if (Number(currentUserId) === Number(targetUserId)) {
    throw new Error("You cannot demote yourself");
  }

  if (user.role === "customer") {
    throw new Error("User is already a normal user");
  }

  if (user.role === "SUPER_ADMIN") {
    throw new Error("Cannot demote a Super Admin");
  }

  const updated = await pool.query(
    `
    UPDATE users
    SET role = 'customer'
    WHERE user_id = $1

    RETURNING
      user_id,
      name,
      email,
      role
    `,
    [targetUserId]
  );

  return updated.rows[0];
};
export const deleteUser = async (currentUserId, targetUserId) => {

  const result = await pool.query(
    `
    SELECT
      user_id,
      name,
      role
    FROM users
    WHERE user_id = $1
    `,
    [targetUserId]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  // Prevent deleting yourself
  if (Number(currentUserId) === Number(targetUserId)) {
    throw new Error("You cannot delete your own account");
  }

  // Prevent deleting another Super Admin
  if (user.role === "SUPER_ADMIN") {
    throw new Error("Cannot delete a Super Admin");
  }

  await pool.query(
    `
    DELETE FROM users
    WHERE user_id = $1
    `,
    [targetUserId]
  );

  return {
    message: "User deleted successfully"
  };
};


export const resetUserPassword = async (
  currentUserId,
  targetUserId,
  newPassword
) => {

  // 1. Find target user
  const result = await pool.query(
    `
    SELECT
      user_id,
      name,
      email,
      role
    FROM users
    WHERE user_id = $1
    `,
    [targetUserId]
  );

  const user = result.rows[0];

  // 2. User not found
  if (!user) {
    throw new Error("User not found");
  }

  // 3. Prevent Super Admin from resetting own password
  if (
    Number(currentUserId) ===
    Number(targetUserId)
  ) {
    throw new Error(
      "You cannot reset your own password"
    );
  }

  // 4. Protect other Super Admin accounts
  if (user.role === "SUPER_ADMIN") {
    throw new Error(
      "Cannot reset password of a Super Admin"
    );
  }

  // 5. Validate password
  if (!newPassword) {
    throw new Error(
      "New password is required"
    );
  }

  if (newPassword.length < 8) {
    throw new Error(
      "Password must be at least 8 characters"
    );
  }

  // 6. Hash new password
  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  // 7. Update password
  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE user_id = $2
    `,
    [
      hashedPassword,
      targetUserId
    ]
  );

  // 8. Return user information
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
  };
};

//User change password
export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) => {

  // 1. Get current user's password
  const result = await pool.query(
    `
    SELECT
      user_id,
      password
    FROM users
    WHERE user_id = $1
    `,
    [userId]
  );

  const user = result.rows[0];

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Verify current password
  const isMatch = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isMatch) {
    const error = new Error(
      "Current password is incorrect"
    );
    error.statusCode = 400;
    throw error;
  }

  // 3. Verify new password confirmation
  if (newPassword !== confirmPassword) {
    const error = new Error(
      "New passwords do not match"
    );
    error.statusCode = 400;
    throw error;
  }

  // 4. Password length
  if (newPassword.length < 8) {
    const error = new Error(
      "New password must be at least 8 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  // 5. Prevent same password
  const samePassword =
    await bcrypt.compare(
      newPassword,
      user.password
    );

  if (samePassword) {
    const error = new Error(
      "New password must be different from current password"
    );
    error.statusCode = 400;
    throw error;
  }

  // 6. Hash new password
  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  // 7. Update password
  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE user_id = $2
    `,
    [
      hashedPassword,
      userId
    ]
  );

  return {
    message: "Password changed successfully"
  };
};
//forget password
// 🔐 REQUEST PASSWORD RESET
export const requestPasswordReset = async (
  email
) => {

  // 1. Find user by email
  const result = await pool.query(
    `
    SELECT
      user_id,
      name,
      email
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  const user = result.rows[0];

  // 🔒 Do not reveal whether the email exists
  if (!user) {
    return {
      message:
        "If this email is registered, a verification code has been sent."
    };
  }

  // 2. Generate 6-digit verification code
  const code = crypto
    .randomInt(100000, 1000000)
    .toString();

  // 3. Hash the code before storing it
  const codeHash =
    await bcrypt.hash(code, 10);

  // 4. Expire after 10 minutes
  const expiresAt =
    new Date(
      Date.now() + 10 * 60 * 1000
    );

  // 5. Invalidate previous unused reset codes
  await pool.query(
    `
    UPDATE password_resets
    SET used_at = CURRENT_TIMESTAMP
    WHERE user_id = $1
      AND used_at IS NULL
    `,
    [user.user_id]
  );

  // 6. Store new reset request
  await pool.query(
    `
    INSERT INTO password_resets
    (
      user_id,
      code_hash,
      expires_at
    )
    VALUES ($1, $2, $3)
    `,
    [
      user.user_id,
      codeHash,
      expiresAt
    ]
  );

  // 🧪 TEMPORARY FOR DEVELOPMENT
  // Later we will send this code by email.
  // 📧 SEND CODE TO USER EMAIL
    await sendPasswordResetEmail(
      user.email,
      code
    );

  return {
    message:
      "If this email is registered, a verification code has been sent."
  };
};

// 🔐 VERIFY PASSWORD RESET CODE
export const verifyPasswordResetCode = async (
  email,
  code
) => {

  // 1. Find user
  const userResult = await pool.query(
    `
    SELECT
      user_id,
      email
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  const user = userResult.rows[0];

  if (!user) {
    const error = new Error(
      "Invalid verification code"
    );

    error.statusCode = 400;

    throw error;
  }

  // 2. Get latest unused reset request
  const resetResult = await pool.query(
    `
    SELECT
      reset_id,
      code_hash,
      expires_at
    FROM password_resets
    WHERE user_id = $1
      AND used_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [user.user_id]
  );

  const reset = resetResult.rows[0];

  if (!reset) {
    const error = new Error(
      "Invalid or expired verification code"
    );

    error.statusCode = 400;

    throw error;
  }

  // 3. Check expiration
  if (
    new Date(reset.expires_at) <
    new Date()
  ) {

    const error = new Error(
      "Verification code has expired"
    );

    error.statusCode = 400;

    throw error;
  }

  // 4. Compare code with hash
  const isMatch =
    await bcrypt.compare(
      code,
      reset.code_hash
    );

  if (!isMatch) {

    const error = new Error(
      "Invalid verification code"
    );

    error.statusCode = 400;

    throw error;
  }

  // 5. Code is valid
  return {
    message:
      "Verification code verified successfully",

    resetId: reset.reset_id,
  };
};

// 🔐 RESET PASSWORD
export const resetPassword = async (
  resetId,
  newPassword,
  confirmPassword
) => {

  // 1. Check reset request
  const resetResult = await pool.query(
    `
    SELECT
      reset_id,
      user_id,
      expires_at,
      used_at
    FROM password_resets
    WHERE reset_id = $1
    `,
    [resetId]
  );

  const reset = resetResult.rows[0];

  if (!reset) {
    const error = new Error(
      "Invalid password reset request"
    );

    error.statusCode = 400;

    throw error;
  }

  // 2. Check if already used
  if (reset.used_at) {
    const error = new Error(
      "This password reset request has already been used"
    );

    error.statusCode = 400;

    throw error;
  }

  // 3. Check expiration
  if (
    new Date(reset.expires_at) <
    new Date()
  ) {

    const error = new Error(
      "Password reset request has expired"
    );

    error.statusCode = 400;

    throw error;
  }

  // 4. Check password confirmation
  if (newPassword !== confirmPassword) {

    const error = new Error(
      "New passwords do not match"
    );

    error.statusCode = 400;

    throw error;
  }

  // 5. Check password length
  if (newPassword.length < 8) {

    const error = new Error(
      "New password must be at least 8 characters"
    );

    error.statusCode = 400;

    throw error;
  }

  // 6. Get current password
  const userResult = await pool.query(
    `
    SELECT
      user_id,
      password
    FROM users
    WHERE user_id = $1
    `,
    [reset.user_id]
  );

  const user = userResult.rows[0];

  if (!user) {

    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 7. Prevent same password
  const samePassword =
    await bcrypt.compare(
      newPassword,
      user.password
    );

  if (samePassword) {

    const error = new Error(
      "New password must be different from current password"
    );

    error.statusCode = 400;

    throw error;
  }

  // 8. Hash new password
  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  // 9. Update password
  await pool.query(
    `
    UPDATE users
    SET password = $1
    WHERE user_id = $2
    `,
    [
      hashedPassword,
      reset.user_id
    ]
  );

  // 10. Mark reset request as used
  await pool.query(
    `
    UPDATE password_resets
    SET used_at = CURRENT_TIMESTAMP
    WHERE reset_id = $1
    `,
    [resetId]
  );

  return {
    message:
      "Password reset successfully"
  };
};