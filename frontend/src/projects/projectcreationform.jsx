import "./projectcreationform.css";
import "./ProjectResponsive.css";
import { useState } from "react";

export default function ProjectCreationForm({ onCreate }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: "medium",
        status: "planned",
        tasks: [""],
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    function handleChange(event, index) {
        const { name, value } = event.target;
        if (name === "task") {
            const updatedTasks = [...formData.tasks];
            updatedTasks[index] = value;
            setFormData((prev) => ({ ...prev, tasks: updatedTasks }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleAddTask() {
        setFormData((prev) => ({ ...prev, tasks: [...prev.tasks, ""] }));
    }

    function handleRemoveTask(index) {
        setFormData((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((_, i) => i !== index),
        }));
    }

    function validate(values) {
        const validationErrors = {};
        if (!values.name.trim()) validationErrors.name = "Project name is required.";
        if (!values.startDate) validationErrors.startDate = "Start date is required.";
        if (!values.endDate) validationErrors.endDate = "End date is required.";
        if (values.startDate && values.endDate && values.endDate < values.startDate) {
            validationErrors.endDate = "End date cannot be earlier than start date.";
        }
        const nonEmptyTasks = values.tasks.filter((t) => t.trim() !== "");
        if (nonEmptyTasks.length === 0) validationErrors.tasks = "Add at least one task.";
        return validationErrors;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        setSubmitted(true);
        const nonEmptyTasks = formData.tasks
            .map((t, idx) => ({ id: `${Date.now()}-${idx}`, title: t.trim() }))
            .filter((t) => t.title !== "");
        const createdProject = {
            name: formData.name,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate,
            priority: formData.priority,
            status: formData.status,
            tasks: nonEmptyTasks,
        };
        if (typeof onCreate === 'function') {
            try {
                setSubmitting(true)
                setSubmitError(null)
                const resp = onCreate(createdProject)
                // support async onCreate
                if (resp && typeof resp.then === 'function') await resp
            } catch (err) {
                setSubmitError(err.message || String(err))
            } finally {
                setSubmitting(false)
            }
        }
    }

    return (
        <section className="project-form-section">
            <div className="form-card">
                <h1 className="form-title">Create Project</h1>
                {submitted && (
                    <div className="alert success" role="status">
                        Submitted. Creating project…
                    </div>
                )}
                    {submitting && (
                        <div className="alert" role="status">Submitting…</div>
                    )}
                    {submitError && (
                        <div className="alert error" role="alert">{submitError}</div>
                    )}
                <form className="project-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        <div className="form-field full">
                            <label htmlFor="name">Project Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g., Website Redesign"
                                value={formData.name}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={errors.name ? "name-error" : undefined}
                            />
                            {errors.name && (
                                <p id="name-error" className="error-text">{errors.name}</p>
                            )}
                        </div>

                        <div className="form-field full">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Brief summary of the project goals"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.startDate)}
                                aria-describedby={errors.startDate ? "startDate-error" : undefined}
                            />
                            {errors.startDate && (
                                <p id="startDate-error" className="error-text">{errors.startDate}</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formData.endDate}
                                onChange={handleChange}
                                aria-invalid={Boolean(errors.endDate)}
                                aria-describedby={errors.endDate ? "endDate-error" : undefined}
                            />
                            {errors.endDate && (
                                <p id="endDate-error" className="error-text">{errors.endDate}</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="planned">Planned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="tasks-section">
                        <div className="tasks-header">
                            <h2 className="section-title">Tasks</h2>
                            <button
                                type="button"
                                className="btn secondary"
                                onClick={handleAddTask}
                                aria-label="Add task"
                            >
                                + Add Task
                            </button>
                        </div>
                        {errors.tasks && (
                            <p className="error-text" role="alert">{errors.tasks}</p>
                        )}
                        <ul className="tasks-list">
                            {formData.tasks.map((task, index) => (
                                <li key={index} className="task-item">
                                    <input
                                        type="text"
                                        name="task"
                                        placeholder={`Task #${index + 1}`}
                                        value={task}
                                        onChange={(e) => handleChange(e, index)}
                                    />
                                    <button
                                        type="button"
                                        className="icon-btn"
                                        aria-label={`Remove task ${index + 1}`}
                                        onClick={() => handleRemoveTask(index)}
                                        disabled={formData.tasks.length === 1}
                                        title={formData.tasks.length === 1 ? "At least one task is required" : "Remove task"}
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="actions">
                        <button type="submit" className="btn primary">Create Project</button>
                        <button
                            type="button"
                            className="btn ghost"
                            onClick={() => {
                                setFormData({
                                    name: "",
                                    description: "",
                                    startDate: "",
                                    endDate: "",
                                    priority: "medium",
                                    status: "planned",
                                    tasks: [""],
                                });
                                setErrors({});
                                setSubmitted(false);
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
