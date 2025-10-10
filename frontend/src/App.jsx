import './App.css'
import { useEffect, useState } from 'react'
import RegistrationPage from './auth/RegistrationPage.jsx'
import ProjectCreationForm from './projects/projectcreationform.jsx'
import ProjectList from './projects/projectlist.jsx'
import * as projectApi from './api/projects'
import ProjectFilters from './components/ProjectFilters.jsx'
import ProjectStatus from './projects/ProjectStatus.jsx'


function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const body = await projectApi.listProjects('1')
        if (!mounted) return
  setProjects(Array.isArray(body.data) ? body.data : [])
  setLoadError(null)
      } catch (err) {
  console.warn('Could not load projects from backend, falling back to empty list', err)
  if (mounted) setProjects([])
  setLoadError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleCreate(project) {
    setSubmitting(true)
    setCreateError(null)
    try {
      const body = await projectApi.createProject({ ...project, createdBy: '1' })
      setProjects(prev => [body.data, ...prev])
    } catch (err) {
      console.error('Failed to create project', err)
      setCreateError(err.message || String(err))
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <main className="app-main">
        <RegistrationPage />
        <ProjectCreationForm onCreate={handleCreate} />
        <>
          <ProjectStatus loading={loading} error={loadError} submitting={submitting} />
          {!loading && (
            <>
              <ProjectFilters query={query} status={statusFilter} onQueryChange={setQuery} onStatusChange={setStatusFilter} />
              <ProjectList projects={projects.filter(p => {
              // status filter
              if (statusFilter && String(p.status).toLowerCase() !== String(statusFilter).toLowerCase()) return false
              // query filter: name, description, or task titles
              if (!query) return true
              const q = String(query).toLowerCase()
              if ((p.name || '').toLowerCase().includes(q)) return true
              if ((p.description || '').toLowerCase().includes(q)) return true
              if (Array.isArray(p.tasks) && p.tasks.some(t => (t.title||'').toLowerCase().includes(q))) return true
              return false
            })} />
            </>
          )}
  </>
      </main>
    </>
  )
}

export default App
