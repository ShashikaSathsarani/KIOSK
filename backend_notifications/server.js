// Import required modules
import express from "express";  //Express framework for creating the server
import cors from "cors";        //Middleware for enabling CORS (Cross-Origin Resource Sharing)
import dotenv from "dotenv";    //For loading environment variables from a .env file
import pkg from "pg";           //PostgreSQL client for Node.js
import fetch from "node-fetch"; //Used to make API requests (for event fetching)

//Load environment variables
dotenv.config();
const { Pool } = pkg; //Extract Pool class from pg package

//Initialize express app
const app = express();
app.use(cors()); //Enable CORS
app.use(express.json()); //Parse JSON bodies in incoming requests

// ---------------- PostgreSQL connection setup ----------------
const pool = new Pool({
  user: process.env.PG_USER, //Database username
  host: process.env.PG_HOST, //Database host (e.g., localhost)
  database: process.env.PG_DATABASE, //Database name
  password: process.env.PG_PASSWORD, //Database password
  port: process.env.PG_PORT, //Database port (usually 5432)
});

// Event API base URL (for fetching event data)
const EVENT_API_URL = process.env.EVENT_API_URL;

// ---------------------- ROUTES ----------------------

// Get all unread notifications from database
app.get("/api/notifications", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE is_read = false ORDER BY created_at DESC"
    );
    res.json(result.rows); // Send the result as JSON
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message }); // Send error if something fails
  }
});

// ---------------------- ADD NOTIFICATION ----------------------

// Endpoint to manually add a new notification
app.post("/api/notifications", async (req, res) => {
  // Debugging logs for incoming request
  console.log("=== POST REQUEST DEBUG ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Body type:", typeof req.body);
  console.log("Body keys:", Object.keys(req.body || {}));
  console.log("========================");

  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("ERROR: Empty body received");
    return res.status(400).json({ error: "Request body is required" });
  }

  // Extract fields from body
  const { title, body, level, data } = req.body;

  // Validate required fields
  if (!title) {
    console.log("ERROR: Missing title");
    return res.status(400).json({ error: "Title is required" });
  }
  if (!body) {
    console.log("ERROR: Missing body");
    return res.status(400).json({ error: "Body is required" });
  }

  try {
    // Convert data object to JSON string (if exists)
    const jsonData = data ? JSON.stringify(data) : "{}";
    console.log("Inserting with jsonData:", jsonData);

    // Insert new notification into database
    const result = await pool.query(
      "INSERT INTO notifications (title, body, level, data) VALUES ($1,$2,$3,$4) RETURNING *",
      [title, body, level || "info", jsonData]
    );

    console.log("SUCCESS: Notification created");
    res.status(201).json(result.rows[0]); // Return the newly created notification
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message }); // Handle DB error
  }
});

// ---------------------- MARK AS READ ----------------------

// Mark a specific notification as read using its ID
app.put("/api/notifications/:id/read", async (req, res) => {
  const { id } = req.params; // Get ID from request URL
  try {
    await pool.query("UPDATE notifications SET is_read = true WHERE id = $1", [id]);
    res.json({ message: "Notification marked as read" }); // Confirmation message
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle DB error
  }
});

// ------------------- DELETE NOTIFICATION -------------------

// Delete a notification by ID
app.delete("/api/notifications/:id", async (req, res) => {
  const { id } = req.params; // Get notification ID
  try {
    // Delete notification and return deleted row
    const result = await pool.query(
      "DELETE FROM notifications WHERE id = $1 RETURNING *",
      [id]
    );

    // Check if notification exists
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Return confirmation with deleted notification data
    res.json({ message: "Notification deleted", deleted: result.rows[0] });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- EVENT-BASED NOTIFICATIONS -------------------

// Function to automatically create notifications from upcoming events
async function createNotificationsFromEvents() {
  try {
    // Fetch event data from external API
    const response = await fetch(EVENT_API_URL);
    const events = await response.json();

    const now = new Date(); // Current time
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now

    // Iterate through each event
    for (const event of events) {
      const start = new Date(event.start_time); // Convert start_time string to Date object

      // Only process events starting within the next 10 minutes
      if (start > now && start <= tenMinutesLater) {
        // Check if a notification for this event already exists
        const exists = await pool.query(
          "SELECT * FROM notifications WHERE data->>'event_id' = $1",
          [String(event.event_id)]
        );

        // If no existing notification, create one
        if (exists.rows.length === 0) {
          const title = `Upcoming Event: ${event.event_title}`;

          // Compute remaining time until event start (for a friendlier message)
          const diffMs = start.getTime() - now.getTime();
          const minutes = Math.max(0, Math.floor(diffMs / (60 * 1000))); // whole minutes
          const seconds = Math.max(0, Math.floor((diffMs % (60 * 1000)) / 1000)); // leftover seconds

          // Format time: "in X minutes" or "in Y seconds" when < 1 minute
          const humanEta = minutes > 0
            ? `${minutes} minute${minutes === 1 ? '' : 's'}`
            : `${seconds} second${seconds === 1 ? '' : 's'}`;

          // Include absolute time as well for clarity
          const timeStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const where = event.location || 'the venue';
          const body = `${event.event_title} starts at ${timeStr} (${humanEta} from now) at ${where}.`;
          const expiresAt = start; // Notification expires when event starts

          // Insert new notification
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

// Delete expired notifications (those with past expires_at timestamps)
async function cleanupNotifications() {
  try {
    await pool.query(
      "DELETE FROM notifications WHERE expires_at IS NOT NULL AND expires_at < NOW()"
    );
  } catch (err) {
    console.error("Error cleaning up expired notifications:", err);
  }
}

// ------------------- AUTO POLLING -------------------

// Run event checking and cleanup every 5 seconds
setInterval(async () => {
  await createNotificationsFromEvents(); // Generate new notifications
  await cleanupNotifications(); // Remove old ones
}, 5 * 1000);

// ------------------- START SERVER -------------------

// Start the Express server on specified port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Notifications backend running on port ${PORT}`));
