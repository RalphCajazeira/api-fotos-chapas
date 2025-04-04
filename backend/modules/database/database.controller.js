const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../../data/db.json");

function getDatabase(req, res) {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const data = raw.trim() ? JSON.parse(raw) : {};
    res.json(data);
  } catch (err) {
    console.error("❌ Error reading DB:", err);
    res.status(500).json({ success: false, error: "Failed to load database" });
  }
}

module.exports = {
  getDatabase,
};
