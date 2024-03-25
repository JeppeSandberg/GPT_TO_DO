// frontend/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// AddTaskForm component
function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

// Task component
function Task({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);

  const handleUpdate = () => {
    onUpdate(task.id, title, description, status);
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
          </select>
          <button onClick={handleUpdate}>Update Task</button>
        </div>
      ) : (
        <div>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

// App component
function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, []);

  const addTask = (title, description) => {
    axios
      .post("http://localhost:5000/tasks", { title, description })
      .then((response) => setTasks([...tasks, response.data]))
      .catch((error) => console.error(error));
  };

  const updateTask = (id, title, description, status) => {
    axios
      .put(`http://localhost:5000/tasks/${id}`, { title, description, status })
      .then((response) =>
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
      )
      .catch((error) => console.error(error));
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then((response) => setTasks(tasks.filter((task) => task.id !== id)))
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <AddTaskForm onAdd={addTask} />
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      ))}
    </div>
  );
}

export default App;
