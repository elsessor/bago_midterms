import "./TaskList.css";
import { useState, useEffect } from "react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: "", description: "" });

  const API_URL = "http://localhost:3000";

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("You must be logged in to view tasks.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks");
      }

      setTasks(data.tasks || data);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete task");
      }

      // Remove task from state
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error("Delete task error:", err);
      alert(err.message || "Failed to delete task");
    }
  }

  function handleEditClick(task) {
    setEditingTask(task.id);
    setEditFormData({
      title: task.title,
      description: task.description,
    });
  }

  function handleEditCancel() {
    setEditingTask(null);
    setEditFormData({ title: "", description: "" });
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleEditSubmit(taskId) {
    if (!editFormData.title.trim() || !editFormData.description.trim()) {
      alert("Title and description are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editFormData.title.trim(),
          description: editFormData.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      // Update task in state
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, title: editFormData.title, description: editFormData.description }
          : task
      ));

      setEditingTask(null);
      setEditFormData({ title: "", description: "" });
    } catch (err) {
      console.error("Update task error:", err);
      alert(err.message || "Failed to update task");
    }
  }

  if (loading) {
    return (
      <section className="task-list-section">
        <div className="task-list-container">
          <h1 className="list-title">Tasks</h1>
          <div className="loading-state">Loading tasks...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="task-list-section">
        <div className="task-list-container">
          <h1 className="list-title">Tasks</h1>
          <div className="error-state">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="task-list-section">
      <div className="task-list-container">
        <div className="list-header">
          <h1 className="list-title">Tasks</h1>
          <button className="btn primary" onClick={fetchTasks}>
            Refresh
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Create your first task to get started!</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                {editingTask === task.id ? (
                  <div className="task-edit-form">
                    <div className="edit-field">
                      <label htmlFor={`edit-title-${task.id}`}>Title</label>
                      <input
                        id={`edit-title-${task.id}`}
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="edit-field">
                      <label htmlFor={`edit-description-${task.id}`}>Description</label>
                      <textarea
                        id={`edit-description-${task.id}`}
                        name="description"
                        rows={3}
                        value={editFormData.description}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="edit-actions">
                      <button 
                        className="btn primary small" 
                        onClick={() => handleEditSubmit(task.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="btn ghost small" 
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <div className="task-info">
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-description">{task.description}</p>
                      {task.createdBy && (
                        <p className="task-meta">Created by: {task.createdBy}</p>
                      )}
                    </div>
                    <div className="task-actions">
                      <button 
                        className="btn secondary small" 
                        onClick={() => handleEditClick(task)}
                        aria-label={`Edit ${task.title}`}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn danger small" 
                        onClick={() => handleDelete(task.id)}
                        aria-label={`Delete ${task.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
