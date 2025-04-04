const service = require('./folder.service');

async function createFolder(req, res) {
  try {
    const { name, parentId = null } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: "Field 'name' is required." });
    }

    const folder = await service.createFolder(name, parentId);
    res.json({ success: true, folder });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  createFolder
};
