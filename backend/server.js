require("dotenv").config();
const fs = require("fs");
const path = require("path");
const app = require("./app");
const {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
} = require("./config/drive");

const PORT = process.env.PORT || 3000;
const DB_LOCAL_PATH = path.join(__dirname, "data/db.json");
const FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

async function init() {
  console.log("🚀 Iniciando sincronização com o Google Drive...");

  if (!fs.existsSync(path.dirname(DB_LOCAL_PATH))) {
    fs.mkdirSync(path.dirname(DB_LOCAL_PATH));
  }

  const existing = await findDatabaseFile(FOLDER_ID);
  if (existing) {
    console.log("📥 Banco encontrado. Baixando...");
    await downloadDatabase(existing.id, DB_LOCAL_PATH);
  } else {
    console.log("📁 Banco não encontrado. Criando novo...");
    await createDatabaseFile(FOLDER_ID, DB_LOCAL_PATH);
  }

  const dbRaw = fs.readFileSync(DB_LOCAL_PATH, "utf-8");
  const db = dbRaw.trim() ? JSON.parse(dbRaw) : { chapas: [] };
  console.log(`✅ Banco carregado com ${db.chapas.length} chapas`);

  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
  });
}

init().catch((err) => {
  console.error("❌ Erro ao iniciar:", err);
});
