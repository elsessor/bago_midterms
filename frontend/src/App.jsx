import './App.css'
import { useState } from 'react'
import RegistrationPage from './auth/RegistrationPage.jsx'
import ProjectCreationForm from './projects/projectcreationform.jsx'

function App() {
  const [projects, setProjects] = useState([
    { id: '1', name: 'Sample Project', description: 'Demo project', startDate: '2025-10-01', endDate: '2025-10-10', priority: 'medium', status: 'planned', tasks: [] }
  ])

  return (
    <>
      <main className="app-main">
        <RegistrationPage />
        <ProjectCreationForm />
      </main>
    </>
  )
}

export default App
