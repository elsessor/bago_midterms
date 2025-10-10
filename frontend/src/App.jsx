import './App.css'
import { useEffect, useState } from 'react'
import RegistrationPage from './auth/RegistrationPage.jsx'
import ProjectCreationForm from './projects/projectcreationform.jsx'
import ProjectList from './projects/projectlist.jsx'
import * as projectApi from './api/projects'


function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

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
        {loading ? <div>Loading projects…</div> : <ProjectList projects={projects} />}
      </main>
    </>
  )
}

export default App
