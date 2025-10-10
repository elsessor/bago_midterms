import React from 'react'
import './ProjectStatus.css'

export default function ProjectStatus({ loading, error, submitting }) {
  if (submitting) {
    return <div className="project-status project-status--submitting">Submitting project…</div>
  }
  if (loading) {
    return <div className="project-status project-status--loading">Loading projects…</div>
  }
  if (error) {
    return <div className="project-status project-status--error">{String(error)}</div>
  }
  return null
}
