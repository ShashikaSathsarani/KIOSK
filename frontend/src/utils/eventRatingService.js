app.post("/api/ratings", async (req, res) => {
  const { event_id, rating } = req.body;
  try {
    await pool.query(
      "INSERT INTO event_ratings (event_id, rating) VALUES ($1, $2)",
      [event_id, rating]
    );
    res.status(201).json({ message: "Rating added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/ratings/:event_id", async (req, res) => {
  const { event_id } = req.params;
  try {
    const result = await pool.query(
      "SELECT AVG(rating)::numeric(10,2) AS avg_rating FROM event_ratings WHERE event_id = $1",
      [event_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
