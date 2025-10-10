let nextUserId = 1;
const users = [];

export function createUser({ username, passwordHash, role = "user" }) {
  const user = { id: String(nextUserId++), username, password: passwordHash, role };
  users.push(user);
  return { id: user.id, username: user.username, role: user.role };
}

export function findByUsername(username) {
  return users.find(u => u.username === username) || null;
}

export function getUserSecretFields(username) {
  const user = users.find(u => u.username === username);
  return user || null;
}

export function findById(id) {
  const user = users.find(u => u.id === id);
  return user ? { id: user.id, username: user.username, role: user.role } : null;
}


