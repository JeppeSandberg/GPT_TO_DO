// backend/db/db.js
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./db/tasks.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the tasks database.");
});

db.run(
  `CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
)`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Tasks table created.");
  }
);

module.exports = db;
