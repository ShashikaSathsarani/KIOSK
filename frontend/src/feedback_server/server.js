// Minimal feedback server (Express) with two storage paths:
// 1) Primary: PostgreSQL INSERT (fast, structured)
// 2) Secondary: Append to a local CSV file as a best-effort fallback/audit log
//
// This file intentionally keeps behaviour simple and synchronous where possible.
// It uses ES modules (import/export) so package.json should include "type": "module".

import express from "express";
import cors from "cors";
import pkg from "pg"; // PostgreSQL client (we only need Pool)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const { Pool } = pkg;

// Create the express app and enable JSON + CORS middleware
const app = express();
app.use(cors());
app.use(express.json());

// Compute a safe path for a CSV file placed next to this server script.
// `fileURLToPath(import.meta.url)` is the ES module-safe way to get __dirname.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, 'feedbacks.csv');

/**
 * Append a single feedback record to CSV.
 * This is best-effort: if it fails we log the error but don't block the API response.
 * We escape double-quotes in the message and include an ISO timestamp.
 */
async function appendFeedbackToCSV(rating, message) {
  try {
    const header = 'rating,message,created_at\n';
    const safeMessage = String(message).replace(/"/g, '""'); // escape double quotes
    const line = `${rating},"${safeMessage}","${new Date().toISOString()}"\n`;

    // If the file doesn't exist yet, write a header first.
    if (!fs.existsSync(csvPath)) {
      await fs.promises.writeFile(csvPath, header + line, 'utf8');
    } else {
      await fs.promises.appendFile(csvPath, line, 'utf8');
    }
  } catch (err) {
    // Let caller handle/log the error; we don't want to crash the server for CSV write errors
    throw err;
  }
}

// --- PostgreSQL connection setup ---
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "feedbackdb",
  password: "hds19735",
  port: 5432,
});

// Try to connect once at startup so connection issues are visible in logs early.
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error", err));

/**
 * POST /feedback
 * Accepts JSON { rating: number, message: string }
 * - Inserts into the `feedbacks` table in Postgres
 * - Also appends to a CSV file (best-effort, failure is logged)
 */
app.post("/feedback", async (req, res) => {
  try {
    const { rating, message } = req.body;

    // Insert into Postgres. Uses parameterized query to avoid SQL injection.
    await pool.query(
      "INSERT INTO feedbacks (rating, message) VALUES ($1, $2)",
      [rating, message]
    );

    // Also append to CSV asynchronously (do not await to keep API responsive).
    appendFeedbackToCSV(rating, message).catch(err => console.error('CSV save error:', err));

    // Respond success to client
    res.json({ success: true });
  } catch (error) {
    // Log and return a generic 500. Do not return internal error details to clients.
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// Start the HTTP server
app.listen(5020, () => console.log("Server running on port 5020"));
