import express from "express";
import cors from "cors";
import pkg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// CSV file path (placed next to this server.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, 'feedbacks.csv');

async function appendFeedbackToCSV(rating, message) {
  try {
    const header = 'rating,message,created_at\n';
    const safeMessage = String(message).replace(/"/g, '""'); // escape double quotes
    const line = `${rating},"${safeMessage}","${new Date().toISOString()}"\n`;
    if (!fs.existsSync(csvPath)) {
      await fs.promises.writeFile(csvPath, header + line, 'utf8');
    } else {
      await fs.promises.appendFile(csvPath, line, 'utf8');
    }
  } catch (err) {
    // Rethrow to let caller decide; caller will log and continue
    throw err;
  }
}

// Database connection
const pool = new Pool({
  user: "postgres",     
  host: "localhost",
  database: "feedbackdb",
  password: "hds19735",  
  port: 5432,
});

// Test connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("DB connection error", err));

// API to save feedback
app.post("/feedback", async (req, res) => {
  try {
    const { rating, message } = req.body;
    await pool.query(
      "INSERT INTO feedbacks (rating, message) VALUES ($1, $2)",
      [rating, message]
    );
    // Also append to CSV (best-effort)
    appendFeedbackToCSV(rating, message).catch(err => console.error('CSV save error:', err));
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(5020, () => console.log("Server running on port 5020"));
