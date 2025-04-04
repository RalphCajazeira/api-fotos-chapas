const service = require("./folder.service");

async function create(req, res) {
  try {
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: "Missing 'name'" });
    }

    const folder = await service.createFolder(name, parentId);
    res.status(201).json({ success: true, folder });
  } catch (err) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  create,
};
