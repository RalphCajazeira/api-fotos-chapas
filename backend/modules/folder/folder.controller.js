const service = require("./folder.service");
const isProduction = process.env.NODE_ENV === "production";

// 🔍 GET /folders → Lista pastas ou filtra por parent_id
async function listFolders(req, res) {
  try {
    const { parent_id } = req.query;

    const folders =
      parent_id !== undefined
        ? await service.getFoldersByParent(
            parent_id === "null" ? null : Number(parent_id)
          )
        : await service.getAll();

    res.json({ success: true, data: folders });
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 📁 POST /folders → Criar nova pasta
async function createFolder(req, res) {
  try {
    const { name, parent_id = null } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Missing 'name' field" });
    }

    const folder = await service.createFolder(name, parent_id);
    res.status(201).json({ success: true, data: folder });
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ✏️ PUT /folders/:id → Renomear pasta
async function renameFolder(req, res) {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName) {
      return res
        .status(400)
        .json({ success: false, error: "Missing 'newName' field" });
    }

    const folder = await service.renameFolder(id, newName);
    res.json({ success: true, data: folder });
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 🗑️ DELETE /folders/:id → Deletar pasta
async function deleteFolder(req, res) {
  try {
    const { id } = req.params;
    await service.deleteFolder(id);
    res.json({ success: true });
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// 🔍 GET /folders/:id → Buscar pasta específica
async function getFolderById(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or missing ID" });
    }

    const folder = await service.getFolderById(Number(id));
    if (!folder) {
      return res
        .status(404)
        .json({ success: false, error: "Folder not found" });
    }

    res.json({ success: true, data: folder });
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  listFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  getFolderById,
};
