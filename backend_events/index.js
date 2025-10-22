import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js"; // Make sure db.js is configured

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Event backend is running ✅");
});

// Route to get events with categories
app.get("/api/events", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id AS event_id,
        e.event_name AS event_title,
        e.location,
        e.start_time,
        e.end_time,
        e.description,
        c.category_name
      FROM events e
      LEFT JOIN eventcategories c
      ON e.category_id = c.category_id
      ORDER BY e.start_time ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: err.message });
  }
});

// Optional: test DB connection when server starts
const testDB = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB connected", res.rows[0]);
  } catch (err) {
    console.error("❌ DB connection error", err);
  }
};
testDB();

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
