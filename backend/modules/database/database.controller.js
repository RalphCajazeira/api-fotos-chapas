const knex = require("../../database/connection");

async function getDatabase(req, res) {
  try {
    const folders = await knex("folders").select("*").orderBy("id", "asc");
    res.json({ success: true, data: folders });
  } catch (err) {
    console.error("❌ Error reading folders from DB:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to load folders from database" });
  }
}

module.exports = {
  getDatabase,
};
