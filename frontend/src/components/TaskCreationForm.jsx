import "./TaskCreationForm.css";
import { useState } from "react";

export default function TaskCreationForm({ onCreate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate(values) {
    const validationErrors = {};
    if (!values.title.trim()) {
      validationErrors.title = "Task title is required.";
    }
    if (!values.description.trim()) {
      validationErrors.description = "Task description is required.";
    }
    return validationErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setSubmitted(false);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      if (!token) {
        setErrors({ general: "You must be logged in to create a task." });
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      setSubmitted(true);
      setErrors({});
      
      // Reset form
      setFormData({
        title: "",
        description: "",
      });

      // Call onCreate callback if provided
      if (typeof onCreate === "function") {
        onCreate(data);
      }

      console.log("Task created successfully:", data);
    } catch (error) {
      console.error("Task creation error:", error);
      setErrors({ general: error.message || "Failed to create task. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setFormData({
      title: "",
      description: "",
    });
    setErrors({});
    setSubmitted(false);
  }

  return (
    <section className="task-form-section">
      <div className="form-card">
        <h1 className="form-title">Create Task</h1>
        
        {submitted && (
          <div className="alert success" role="status">
            Task created successfully!
          </div>
        )}

        {errors.general && (
          <div className="alert error" role="alert">
            {errors.general}
          </div>
        )}

        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field full">
              <label htmlFor="title">Task Title</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Design homepage mockup"
                value={formData.title}
                onChange={handleChange}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p id="title-error" className="error-text">{errors.title}</p>
              )}
            </div>

            <div className="form-field full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Describe the task in detail..."
                value={formData.description}
                onChange={handleChange}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
              />
              {errors.description && (
                <p id="description-error" className="error-text">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Creating..." : "Create Task"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
