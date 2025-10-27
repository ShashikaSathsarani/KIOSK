import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createPool({
  host: "localhost",
  user: "myuser",
  password: "1234",
  database: "engex"
});

// Get all departments
app.get("/departments", (req, res) => {
  db.query("SELECT id, name, projects, color FROM departments", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get department by ID
app.get("/departments/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM departments WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Department not found" });
    res.json(results[0]);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
