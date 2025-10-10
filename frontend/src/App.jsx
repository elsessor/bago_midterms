import './App.css'
import RegistrationPage from './auth/RegistrationPage.jsx'
import ProjectCreationForm from './projects/projectcreationform.jsx'

function App() {
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
