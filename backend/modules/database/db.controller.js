const db = require("../../database/connection");

async function pingDatabase(req, res) {
  try {
    const result = await db.raw("SELECT 1+1 AS result");
    res.json({ success: true, db: result.rows[0].result });
  } catch (err) {
    console.error("❌ DB Connection error:", err.message);
    res.status(500).json({ success: false, error: "Database not reachable" });
  }
}

module.exports = { pingDatabase };
