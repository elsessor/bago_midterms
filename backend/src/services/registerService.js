import bcrypt from "bcryptjs";
import { createUser, findByUsername } from "../models/userModel.js";

const DEFAULT_ROLE = "user";

export async function registerUser(username, password, role = DEFAULT_ROLE) {
  const existing = await findByUsername(username);
  if (existing) {
    const error = new Error("Username already exists");
    error.code = "USERNAME_TAKEN";
    error.status = 409;
    throw error;
  }

  if (typeof password !== "string" || password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.code = "WEAK_PASSWORD";
    error.status = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = await createUser({ username, passwordHash: hash, role });
  return newUser;
}