import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Event backend is running ✅");
});

// ✅ Updated route: Get events with category names
app.get("/api/events", async (req, res) => {
  try {
    const query = `
      SELECT 
        e.event_id,
        e.event_title,
        e.description,
        e.location,
        e.start_time,
        e.end_time,
        c.category_name
      FROM events e
      LEFT JOIN eventcategories c
      ON e.category_id = c.category_id
      ORDER BY e.start_time ASC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Optional: Fetch all categories
app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM eventcategories ORDER BY category_id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching categories:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
