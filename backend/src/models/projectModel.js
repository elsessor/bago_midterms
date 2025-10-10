let nextProjectId = 1;
const projects = [];

/**
 * Create a new project
 * @param {{ name: string, description?: string, createdBy: string }} param0
 */
export function createProject({ name, description = "", createdBy }) {
  // Basic validation: name is required and must be a non-empty string
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Project name is required');
  }
  // createdBy should be provided (string or number) — allow truthy values
  if (typeof createdBy === 'undefined' || createdBy === null || String(createdBy).trim() === '') {
    throw new Error('createdBy is required');
  }

  const project = { id: String(nextProjectId++), name: name.trim(), description, createdBy: String(createdBy) };
  projects.push(project);
  // return a public view
  return { id: project.id, name: project.name, description: project.description, createdBy: project.createdBy };
}

export function findProjectById(id) {
  const p = projects.find(pr => pr.id === id);
  return p ? { id: p.id, name: p.name, description: p.description, createdBy: p.createdBy } : null;
}

export function listProjects() {
  return projects.map(p => ({ id: p.id, name: p.name, description: p.description, createdBy: p.createdBy }));
}

export function findProjectsByCreator(userId) {
  return projects.filter(p => p.createdBy === String(userId)).map(p => ({ id: p.id, name: p.name, description: p.description, createdBy: p.createdBy }));
}
