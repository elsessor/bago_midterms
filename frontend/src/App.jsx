import './App.css'
import RegistrationPage from './auth/RegistrationPage.jsx'
import LoginPage from './auth/LoginPage.jsx'

function App() {
  return (
    <>
      <main className="app-main">
        <RegistrationPage />
        <LoginPage />
      </main>
    </>
  )
}

export default App
