import './projectlist.css';

function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function formatStatus(value) {
    if (!value) return '—';
    const normalized = String(value).toLowerCase();
    if (normalized === 'in_progress' || normalized === 'inprogress') return 'In Progress';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

const ProjectList = ({ projects }) => {
    if (!projects || projects.length === 0) {
        return (
            <div className="project-list__state">
                <span>No projects yet. Create one above.</span>
            </div>
        );
    }

    return (
        <div className="project-list">
            {projects.map((project) => (
                <section key={project.id} className="project-card">
                    <header className="project-card__header">
                        <h2 className="project-card__title">{project.name || project.title || 'Untitled Project'}</h2>
                        {project.description && (
                            <p className="project-card__description">{project.description}</p>
                        )}
                        <div className="project-meta">
                            <span>Start: {formatDate(project.startDate)}</span>
                            <span>End: {formatDate(project.endDate)}</span>
                            <span>Priority: {project.priority || '—'}</span>
                            {project.status && (
                                <span className={`task-item__status task-item__status--${String(project.status).toLowerCase()}`}>
                                    {formatStatus(project.status)}
                                </span>
                            )}
                        </div>
                    </header>
                    <div className="task-list">
                        {(project.tasks && project.tasks.length > 0) ? (
                            <ul className="task-list__items">
                                {project.tasks.map((task) => (
                                    <li key={task.id} className="task-item">
                                        <div className="task-item__content">
                                            <span className="task-item__title">{task.title}</span>
                                            {task.status && (
                                                <span className={`task-item__status task-item__status--${String(task.status).toLowerCase()}`}>
                                                    {String(task.status)}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="task-list__empty">No tasks.</div>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default ProjectList;