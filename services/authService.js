import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (data) => {
  const { name, email, password, phone } = data;

  if (!password) {
    throw new Error("Password is required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password, phone) VALUES ($1,$2,$3,$4) RETURNING user_id, name, email, phone",
    [name, email, hashedPassword, phone]
  );

  return result.rows[0];
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // create token
  const token = jwt.sign(
    { id: user.user_id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
    user_id: user.user_id,

    name: user.name,

    email: user.email,

    phone: user.phone,

    role: user.role,

    profile_image: user.profile_image

    }
  };
};