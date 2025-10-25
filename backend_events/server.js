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

/**
 * GET /api/events
 * Returns events with a `categories` array for each event.
 */
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
        -- Aggregate category names into a text array (empty array if none)
        COALESCE(
          ARRAY_AGG(c.category_name ORDER BY c.category_name) FILTER (WHERE c.category_id IS NOT NULL),
          ARRAY[]::text[]
        ) AS categories
      FROM events e
      LEFT JOIN event_category_map m ON m.event_id = e.event_id
      LEFT JOIN eventcategories c ON c.category_id = m.category_id
      GROUP BY e.event_id
      ORDER BY e.start_time ASC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/eventCategories
 * Existing endpoint: returns id, name, description
 */
app.get("/api/eventCategories", async (req, res) => {
  try {
    const query = `
      SELECT 
        category_id, 
        category_name, 
        description
      FROM eventcategories
      ORDER BY category_name ASC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching event categories:", error);
    res.status(500).json({ error: "Failed to fetch event categories" });
  }
});

/**
 * POST /api/events
 * Create an event and (optionally) map it to categories.
 * Expected JSON body:
 * {
 *   event_title, start_time, end_time, location, description,
 *   categories: ['Arts','Games'] // optional array of category names (strings)
 * }
 */
app.post("/api/events", async (req, res) => {
  const { event_title, start_time, end_time, location, description, categories = [] } = req.body;

  if (!event_title || !start_time || !end_time) {
    return res.status(400).json({ error: "Missing required fields: event_title, start_time, end_time" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert event row
    const insertEventSQL = `
      INSERT INTO events (event_title, start_time, end_time, location, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING event_id;
    `;
    const { rows } = await client.query(insertEventSQL, [event_title, start_time, end_time, location, description]);
    const eventId = rows[0].event_id;

    // If categories provided: insert mapping rows by resolving category names to category_id
    if (Array.isArray(categories) && categories.length > 0) {
      const insertMapSQL = `
        INSERT INTO event_category_map (event_id, category_id)
        SELECT $1, ec.category_id
        FROM eventcategories ec
        WHERE ec.category_name = ANY($2::text[])
        ON CONFLICT (event_id, category_id) DO NOTHING;
      `;
      await client.query(insertMapSQL, [eventId, categories]);
    }

    await client.query("COMMIT");
    res.status(201).json({ event_id: eventId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Failed to create event" });
  } finally {
    client.release();
  }
});

/**
 * Optional: GET /api/categories (same as before)
 */
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
