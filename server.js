require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
} = require("./utils/drive");

const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

const DB_LOCAL_PATH = path.join(__dirname, "data", "db.json");
const FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

// CORS liberado para GitHub Pages
const allowedOrigins = [
  "https://ralphcajazeira.github.io",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/", uploadRoutes);

// Lista do banco de dados
app.get("/db", (req, res) => {
  try {
    const data = fs.readFileSync(DB_LOCAL_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler banco de dados." });
  }
});

// Inicialização com sync do Drive
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

  const db = JSON.parse(fs.readFileSync(DB_LOCAL_PATH, "utf-8"));
  console.log(`✅ Banco carregado com ${db.chapas.length} chapas`);

  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando: http://localhost:${PORT}`);
  });
}

init().catch((err) => {
  console.error("❌ Erro ao iniciar:", err);
});
