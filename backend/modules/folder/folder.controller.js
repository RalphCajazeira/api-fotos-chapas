const service = require("./folder.service");

async function listFolders(req, res) {
  try {
    const folders = await service.getAll();
    res.json(folders);
  } catch (err) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function createFolder(req, res) {
  try {
    const { name, parent_id = null } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }

    const folder = await service.createFolder(name, parent_id);
    res.json({ success: true, folder });
  } catch (err) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function renameFolder(req, res) {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res.status(400).json({ success: false, error: "New name is required" });
    }

    const updated = await service.renameFolder(id, newName);
    res.json({ success: true, folder: updated });
  } catch (err) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function deleteFolder(req, res) {
  try {
    const { id } = req.params;
    await service.deleteFolder(id);
    res.json({ success: true, message: "Folder deleted" });
  } catch (err) {
    console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  listFolders,
  createFolder,
  renameFolder,
  deleteFolder,
};
