import React from 'react'
import './NavBar.css'

export default function NavBar({ view, onNavigate }) {
  return (
    <header className="app-header">
      <h1 className="brand">My App</h1>
      <nav className="nav">
        <button className={`link-button ${view === 'login' ? 'active' : ''}`} onClick={() => onNavigate('login')}>Login</button>
        <button className={`link-button ${view === 'tasks' ? 'active' : ''}`} onClick={() => onNavigate('tasks')}>Tasks</button>
        <button className={`link-button ${view === 'projects' ? 'active' : ''}`} onClick={() => onNavigate('projects')}>Projects</button>
      </nav>
    </header>
  )
}
