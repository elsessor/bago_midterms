import { body } from "express-validator";

export const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
  
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
    
  body("status")
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage("Status must be one of: pending, in_progress, completed"),
    
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .toDate()
];

export const updateTaskValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title must be less than 100 characters"),
    
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
    
  body("status")
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage("Status must be one of: pending, in_progress, completed"),
    
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date")
    .toDate()
];

