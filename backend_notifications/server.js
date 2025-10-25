import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// 📨 Get all notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add new notification
app.post("/api/notifications", async (req, res) => {
  const { title, body, level, data } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notifications (title, body, level, data) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, body, level || "info", data || {}]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Mark as read
app.put("/api/notifications/:id/read", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
