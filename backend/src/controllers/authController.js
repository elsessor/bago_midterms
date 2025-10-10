import { validationResult } from "express-validator";
import { registerUser, authenticateUser } from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/responder.js";

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, "Validation failed", 422, "VALIDATION_ERROR", errors.array());
  }
  const { username, password } = req.body;
  try {
    const user = await registerUser(username, password);
    return successResponse(res, { user }, "User registered", 201);
  } catch (err) {
    const status = err.status || 400;
    const code = err.code || "REGISTER_ERROR";
    return errorResponse(res, err.message, status, code);
  }
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, "Validation failed", 422, "VALIDATION_ERROR", errors.array());
  }
  const { username, password } = req.body;
  try {
    const { token, user } = await authenticateUser(username, password);
    return successResponse(res, { token, user }, "Authenticated", 200);
  } catch (err) {
    const status = err.status || 401;
    const code = err.code || "AUTH_ERROR";
    return errorResponse(res, err.message, status, code);
  }
}


