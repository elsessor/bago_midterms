import { body } from "express-validator";

export const registerValidator = [
  body("username").trim().notEmpty().withMessage("username is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
];

export const loginValidator = [
  body("username").trim().notEmpty().withMessage("username is required"),
  body("password")
    .isString()
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
];


