import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import fetch from "node-fetch";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Event backend URL from .env
const EVENT_API_URL = process.env.EVENT_API_URL;

// ---------------------- ROUTES ----------------------

// Get unread notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE is_read = false ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add notification manually
app.post("/api/notifications", async (req, res) => {
  const { title, body, level, data } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notifications (title, body, level, data) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, body, level || "info", data || {}]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
app.put("/api/notifications/:id/read", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- EVENT-BASED NOTIFICATIONS -------------------

async function createNotificationsFromEvents() {
  try {
    const response = await fetch(EVENT_API_URL);
    const events = await response.json();

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

    for (const event of events) {
      const start = new Date(event.start_time);

      // Only events starting in the next 10 minutes
      if (start > now && start <= tenMinutesLater) {
        // Check if notification already exists
        const exists = await pool.query(
          "SELECT * FROM notifications WHERE data->>'event_id' = $1",
          [String(event.event_id)]
        );

        if (exists.rows.length === 0) {
          const title = `Upcoming Event: ${event.event_title}`;
          const body = `Event starts at ${start.toLocaleTimeString()}`;
          const expiresAt = start;

          await pool.query(
            "INSERT INTO notifications (title, body, level, data, expires_at) VALUES ($1,$2,$3,$4,$5)",
            [title, body, "info", JSON.stringify({ event_id: event.event_id }), expiresAt]
          );
          console.log(`Notification created for event: ${event.event_title}`);
        }
      }
    }
  } catch (err) {
    console.error("Error creating notifications from events:", err);
  }
}

// ------------------- CLEANUP EXPIRED NOTIFICATIONS -------------------

async function cleanupNotifications() {
  try {
    await pool.query("DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at < NOW()");
  } catch (err) {
    console.error("Error cleaning up expired notifications:", err);
  }
}

// ------------------- AUTO POLLING -------------------

// Run every 1 minute
setInterval(async () => {
  await createNotificationsFromEvents();
  await cleanupNotifications();
}, 60 * 1000);

// ------------------- START SERVER -------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Notifications backend running on port ${PORT}`));
