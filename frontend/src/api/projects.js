const API_BASE = import.meta.env.VITE_API_URL || ''

export async function listProjects(creatorId) {
  const url = `${API_BASE}/api/projects?creator=${encodeURIComponent(creatorId)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export async function createProject(payload) {
  const url = `${API_BASE}/api/projects`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error || 'Create failed')
  }
  return res.json()
}

export default { listProjects, createProject }
