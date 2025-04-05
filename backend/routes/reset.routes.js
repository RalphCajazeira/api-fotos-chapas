const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { drive } = require("../libs/drive");

const ROOT_FOLDER = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

router.post("/reset", async (req, res) => {
  try {
    // 1. Apagar todos os arquivos/pastas do Drive na pasta raiz
    const list = await drive.files.list({
      q: `'${ROOT_FOLDER}' in parents and trashed = false`,
      fields: "files(id, name)",
    });

    const deletePromises = list.data.files.map((file) =>
      drive.files.delete({ fileId: file.id })
    );

    await Promise.all(deletePromises);
    console.log("🗑️ Todos os arquivos/pastas removidos do Drive");

    // 2. Resetar banco de dados
    await db.raw("TRUNCATE TABLE folders RESTART IDENTITY CASCADE");
    console.log("🧹 Banco de dados limpo e IDs resetados");

    res.json({ success: true, message: "🚨 Reset geral concluído com sucesso!" });
  } catch (err) {
    console.error("❌ Erro no reset geral:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
