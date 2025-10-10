import React from 'react'
import './ProjectFilters.css'

export default function ProjectFilters({ query, status, onQueryChange, onStatusChange }) {
  return (
    <div className="project-filters">
      <input
        className="filter-input"
        placeholder="Search projects or tasks..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search projects"
      />
      <select className="filter-select" value={status} onChange={(e) => onStatusChange(e.target.value)}>
        <option value="">All statuses</option>
        <option value="planned">Planned</option>
        <option value="in_progress">In Progress</option>
        <option value="on_hold">On Hold</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  )
}
