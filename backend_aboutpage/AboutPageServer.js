import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection (use environment variables when possible)
const db = new Pool({
  host: process.env.PG_HOST || "localhost",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD || "1234",
  database: process.env.PG_DATABASE || "engex",
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
});

// Get all departments
app.get("/departments", async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, projects, color FROM departments");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get department by ID
app.get("/departments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM departments WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(5000, async () => {
  console.log("✅ AboutPage server running on port 5000");
  try {
    const client = await db.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("✅ Connected to PostgreSQL database");
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
  }
});