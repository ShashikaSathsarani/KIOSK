import pool from '../../../db/db.js';

// ==============================
// GET ALL Exhibits
// ==============================
const getExhibits = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.exhibit_ID, e.exhibit_name, b.building_name, z.zone_name, e.tags
       FROM exhibits e
       JOIN building b ON e.building_ID = b.building_ID
       JOIN zone z ON b.zone_ID = z.zone_ID
       ORDER BY e.exhibit_ID;`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching exhibits:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// ==============================
// GET exhibit BY Tag
// ==============================
const getExhibitByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const result = await pool.query(
      `SELECT e.exhibit_ID, e.exhibit_name, b.building_name, z.zone_name, e.tags
       FROM exhibits e
       JOIN building b ON e.building_ID = b.building_ID
       JOIN zone z ON b.zone_ID = z.zone_ID
       WHERE $1 = ANY(e.tags)`,
      [tag]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Exhibit not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching exhibit by tag:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

export default {
  getExhibits,
  getExhibitByTag,
};

