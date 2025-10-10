import './App.css'
import { useEffect, useState } from 'react'
import RegistrationPage from './auth/RegistrationPage.jsx'
import ProjectCreationForm from './projects/projectcreationform.jsx'
import ProjectList from './projects/projectlist.jsx'
import * as projectApi from './api/projects'
import ProjectFilters from './components/ProjectFilters.jsx'


function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const body = await projectApi.listProjects('1')
        if (!mounted) return
        setProjects(Array.isArray(body.data) ? body.data : [])
      } catch (err) {
        console.warn('Could not load projects from backend, falling back to empty list', err)
        if (mounted) setProjects([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleCreate(project) {
    try {
      const body = await projectApi.createProject({ ...project, createdBy: '1' })
      setProjects(prev => [body.data, ...prev])
    } catch (err) {
      console.error('Failed to create project', err)
    }
  }

  return (
    <>
      <main className="app-main">
        <RegistrationPage />
        <ProjectCreationForm onCreate={handleCreate} />
        {loading ? <div>Loading projects…</div> : (
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
      </main>
    </>
  )
}

export default App
