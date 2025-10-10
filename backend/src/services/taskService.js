import { findById } from "../models/userModel.js";

let nextTaskId = 1;
const tasks = [];

/**
 * Creates a new task linked to a user
 * @param {Object} taskData - The task data
 * @param {string} taskData.title - Task title (required)
 * @param {string} taskData.description - Task description (optional)
 * @param {string} taskData.status - Task status (optional, defaults to 'pending')
 * @param {Date} taskData.dueDate - Due date (optional)
 * @param {string} userId - ID of the user creating the task
 * @returns {Object} Created task object
 */
export async function createTask(taskData, userId) {
  const user = await findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    error.status = 404;
    throw error;
  }

  if (!taskData.title || typeof taskData.title !== 'string' || taskData.title.trim().length === 0) {
    const error = new Error("Title is required and must be a non-empty string");
    error.code = "INVALID_TITLE";
    error.status = 400;
    throw error;
  }

  if (taskData.title.length > 100) {
    const error = new Error("Title must be less than 100 characters");
    error.code = "TITLE_TOO_LONG";
    error.status = 400;
    throw error;
  }

  if (taskData.description && taskData.description.length > 1000) {
    const error = new Error("Description must be less than 1000 characters");
    error.code = "DESCRIPTION_TOO_LONG";
    error.status = 400;
    throw error;
  }

  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (taskData.status && !validStatuses.includes(taskData.status)) {
    const error = new Error("Status must be one of: pending, in_progress, completed");
    error.code = "INVALID_STATUS";
    error.status = 400;
    throw error;
  }

  if (taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate);
    if (isNaN(dueDate.getTime())) {
      const error = new Error("Due date must be a valid date");
      error.code = "INVALID_DUE_DATE";
      error.status = 400;
      throw error;
    }
  }

  const task = {
    id: String(nextTaskId++),
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : null,
    status: taskData.status || 'pending',
    dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  tasks.push(task);

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    createdBy: task.createdBy,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

/**
 * Gets all tasks for a specific user
 * @param {string} userId - ID of the user
 * @returns {Array} Array of task objects
 */
export async function getUserTasks(userId) {
  const user = await findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.code = "USER_NOT_FOUND";
    error.status = 404;
    throw error;
  }

  return tasks
    .filter(task => task.createdBy === userId)
    .map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      createdBy: task.createdBy,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
}

/**
 * Gets a specific task by ID
 * @param {string} taskId - ID of the task
 * @param {string} userId - ID of the user (for authorization)
 * @returns {Object} Task object
 */
export async function getTaskById(taskId, userId) {
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    const error = new Error("Task not found");
    error.code = "TASK_NOT_FOUND";
    error.status = 404;
    throw error;
  }

  // Check if user owns the task
  if (task.createdBy !== userId) {
    const error = new Error("Access denied");
    error.code = "ACCESS_DENIED";
    error.status = 403;
    throw error;
  }

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    createdBy: task.createdBy,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

/**
 * Updates an existing task
 * @param {string} taskId - ID of the task to update
 * @param {Object} updateData - Data to update
 * @param {string} userId - ID of the user (for authorization)
 * @returns {Object} Updated task object
 */
export async function updateTask(taskId, updateData, userId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    const error = new Error("Task not found");
    error.code = "TASK_NOT_FOUND";
    error.status = 404;
    throw error;
  }

  const task = tasks[taskIndex];

  // Check if user owns the task
  if (task.createdBy !== userId) {
    const error = new Error("Access denied");
    error.code = "ACCESS_DENIED";
    error.status = 403;
    throw error;
  }

  // Validate updates
  if (updateData.title !== undefined) {
    if (typeof updateData.title !== 'string' || updateData.title.trim().length === 0) {
      const error = new Error("Title cannot be empty");
      error.code = "INVALID_TITLE";
      error.status = 400;
      throw error;
    }
    if (updateData.title.length > 100) {
      const error = new Error("Title must be less than 100 characters");
      error.code = "TITLE_TOO_LONG";
      error.status = 400;
      throw error;
    }
  }

  if (updateData.description !== undefined && updateData.description !== null) {
    if (updateData.description.length > 1000) {
      const error = new Error("Description must be less than 1000 characters");
      error.code = "DESCRIPTION_TOO_LONG";
      error.status = 400;
      throw error;
    }
  }

  if (updateData.status !== undefined) {
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(updateData.status)) {
      const error = new Error("Status must be one of: pending, in_progress, completed");
      error.code = "INVALID_STATUS";
      error.status = 400;
      throw error;
    }
  }

  if (updateData.dueDate !== undefined) {
    if (updateData.dueDate !== null) {
      const dueDate = new Date(updateData.dueDate);
      if (isNaN(dueDate.getTime())) {
        const error = new Error("Due date must be a valid date");
        error.code = "INVALID_DUE_DATE";
        error.status = 400;
        throw error;
      }
    }
  }

  // Update task
  const updatedTask = {
    ...task,
    ...updateData,
    updatedAt: new Date()
  };

  // Clean up undefined values
  if (updatedTask.description === undefined) {
    updatedTask.description = task.description;
  }
  if (updatedTask.dueDate === undefined) {
    updatedTask.dueDate = task.dueDate;
  }

  tasks[taskIndex] = updatedTask;

  return {
    id: updatedTask.id,
    title: updatedTask.title,
    description: updatedTask.description,
    status: updatedTask.status,
    dueDate: updatedTask.dueDate,
    createdBy: updatedTask.createdBy,
    createdAt: updatedTask.createdAt,
    updatedAt: updatedTask.updatedAt
  };
}

/**
 * Deletes a task
 * @param {string} taskId - ID of the task to delete
 * @param {string} userId - ID of the user (for authorization)
 * @returns {boolean} True if task was deleted
 */
export async function deleteTask(taskId, userId) {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    const error = new Error("Task not found");
    error.code = "TASK_NOT_FOUND";
    error.status = 404;
    throw error;
  }

  const task = tasks[taskIndex];

  // Check if user owns the task
  if (task.createdBy !== userId) {
    const error = new Error("Access denied");
    error.code = "ACCESS_DENIED";
    error.status = 403;
    throw error;
  }

  // Remove task
  tasks.splice(taskIndex, 1);
  return true;
}
