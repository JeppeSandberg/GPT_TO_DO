// backend/index.js
const express = require("express");
const cors = require("cors");
const db = require("./db/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { title, description } = req.body;
  db.run(
    "INSERT INTO tasks(title, description) VALUES(?, ?)",
    [title, description],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      res.json({ id: this.lastID, title, description, status: "pending" });
    }
  );
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  db.run(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, id],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      res.json({ id: Number(id), title, description, status });
    }
  );
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ id: Number(id) });
  });
});

// Add routes for update and delete

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
