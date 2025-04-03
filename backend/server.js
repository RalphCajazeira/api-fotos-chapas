require("dotenv").config();
const path = require("path");
const fs = require("fs");
const app = require("./app");

const { findDatabaseFile, downloadDatabase, createDatabaseFile } = require("./config/drive");

const DB_LOCAL_PATH = path.join(__dirname, "data", "db.json");
const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

async function init() {
  console.log("🚀 Iniciando sincronização com o Google Drive...");

  if (!fs.existsSync(path.dirname(DB_LOCAL_PATH))) {
    fs.mkdirSync(path.dirname(DB_LOCAL_PATH), { recursive: true });
  }

  const existing = await findDatabaseFile(DRIVE_FOLDER_ID);

  if (existing) {
    console.log("📥 Banco encontrado. Baixando...");
    await downloadDatabase(existing.id, DB_LOCAL_PATH);
  } else {
    console.log("📁 Banco não encontrado. Criando objeto vazio...");
    const emptyObject = {};
    fs.writeFileSync(DB_LOCAL_PATH, JSON.stringify(emptyObject, null, 2));
    await createDatabaseFile(DRIVE_FOLDER_ID, DB_LOCAL_PATH);
  }

  const db = JSON.parse(fs.readFileSync(DB_LOCAL_PATH, "utf-8"));
  console.log(`✅ Banco carregado com ${Object.keys(db).length} chaves`);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
  });
}

init().catch((err) => {
  console.error("❌ Erro ao iniciar:", err);
});
