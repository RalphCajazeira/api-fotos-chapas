const service = require("./file.service");
const isProduction = process.env.NODE_ENV === "production";

async function upload(req, res) {
  try {
    const { folder_id, internal_code, width, height } = req.body;
    const file = req.file;

    const saved = await service.uploadFile(
      file,
      folder_id,
      internal_code,
      width,
      height
    );
    res.json(saved);
  } catch (err) {
    if (!isProduction) console.error("❌ Controller error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getAll(req, res) {
  try {
    const files = await service.getAll();
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getByFolder(req, res) {
  try {
    const { folder_id } = req.params;
    const files = await service.getByFolder(folder_id);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    await service.deleteFile(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  upload,
  getAll,
  getByFolder,
  remove,
};
