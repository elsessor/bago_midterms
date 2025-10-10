let nextProjectId = 1;
const projects = [];

/**
 * Create a new project
 * @param {{ name: string, description?: string, createdBy: string }} param0
 */
export function createProject({ name, description = "", createdBy }) {
  const project = { id: String(nextProjectId++), name, description, createdBy };
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
  return projects.filter(p => p.createdBy === userId).map(p => ({ id: p.id, name: p.name, description: p.description, createdBy: p.createdBy }));
}
