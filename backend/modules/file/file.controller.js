const service = require("./file.service");
const isProduction = process.env.NODE_ENV === "production";

async function upload(req, res) {
  try {
    const { folder_id, name, internal_code, width, height } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, error: "No file was uploaded." });
    }

    if (!folder_id) {
      return res
        .status(400)
        .json({ success: false, error: "folder_id is required." });
    }

    const saved = await service.uploadFile(
      file,
      folder_id,
      name,
      width,
      height,
      internal_code
    );

    res.json({ success: true, data: saved });
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getAll(req, res) {
  try {
    const files = await service.getAll();
    res.json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getByFolder(req, res) {
  try {
    const { folder_id } = req.params;
    const files = await service.getByFolder(folder_id);
    res.json({ success: true, data: files });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await service.deleteFile(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  upload,
  getAll,
  getByFolder,
  remove,
};
