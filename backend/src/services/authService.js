import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserSecretFields } from "../models/userModel.js";

export async function authenticateUser(username, password) {
  const userSecret = await getUserSecretFields(username);
  if (!userSecret) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    error.status = 401;
    throw error;
  }

  // Support either field name returned by your model
  const hashed = userSecret.password || userSecret.passwordHash;
  const isMatch = await bcrypt.compare(password, hashed);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.code = "INVALID_CREDENTIALS";
    error.status = 401;
    throw error;
  }

  const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
  const token = jwt.sign(
    { sub: userSecret.id, username: userSecret.username, role: userSecret.role },
    jwtSecret,
    { expiresIn: "1h" }
  );

  return { token, user: { id: userSecret.id, username: userSecret.username, role: userSecret.role } };
}