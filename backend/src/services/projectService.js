import { createProject as createProjectModel, findProjectsByCreator } from "../models/projectModel.js";
import { findById as findUserById } from "../models/userModel.js";

/**
 * Create a project after validating the creator exists.
 * @param {{ name: string, description?: string, createdBy: string }} input
 */
export async function createProject(input) {
  // Verify creator exists
  const creator = await findUserById(String(input.createdBy));
  if (!creator) {
    const error = new Error("Creator not found");
    error.code = "CREATOR_NOT_FOUND";
    error.status = 404;
    throw error;
  }

  // Delegate to model (model will validate name)
  const project = await createProjectModel(input);
  return project;
}

export async function listProjectsByCreator(userId) {
  return findProjectsByCreator(String(userId));
}
