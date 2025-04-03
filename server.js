require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
} = require("./utils/drive");

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;
const DB_LOCAL_PATH = path.join(__dirname, "data", "db.json");
const PORT = process.env.PORT || 3000;

const app = express();

// 🛡️ CORS permitido só para GitHub Pages + local
const allowedOrigins = [
  "https://ralphcajazeira.github.io",
  "http://localhost:3000",
];

app.use(cors({ origin: allowedOrigins }));

// 🧾 Multer para upload de imagem
const upload = multer({ dest: "uploads/" });

// 🔁 Rota para listar banco de dados
app.get("/db", (req, res) => {
  try {
    const data = fs.readFileSync(DB_LOCAL_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("❌ Erro ao ler db.json:", err);
    res.status(500).json({ error: "Erro ao ler banco de dados." });
  }
});

// 📤 Rota de upload (apenas salva o nome por enquanto)
app.post("/upload", upload.single("foto"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Arquivo não encontrado" });
    }

    // Simulação (mais tarde integramos com Drive + banco)
    res.json({
      success: true,
      fileName: file.originalname,
      message: "Upload recebido com sucesso!",
    });
  } catch (err) {
    console.error("❌ Erro no upload:", err);
    res
      .status(500)
      .json({ success: false, message: "Erro interno no upload." });
  }
});

// 🚀 Inicializa e sincroniza banco
async function init() {
  console.log("🚀 Iniciando verificação do banco no Google Drive...");

  if (!fs.existsSync(path.dirname(DB_LOCAL_PATH))) {
    fs.mkdirSync(path.dirname(DB_LOCAL_PATH));
  }

  const existing = await findDatabaseFile(DRIVE_FOLDER_ID);

  if (existing) {
    console.log("📥 Banco encontrado no Drive. Baixando...");
    await downloadDatabase(existing.id, DB_LOCAL_PATH);
    console.log("✅ Banco sincronizado localmente!");
  } else {
    console.log("📁 Banco não encontrado. Criando novo...");
    const newId = await createDatabaseFile(DRIVE_FOLDER_ID, DB_LOCAL_PATH);
    console.log(`✅ Banco criado e enviado ao Drive com ID: ${newId}`);
  }

  const db = JSON.parse(fs.readFileSync(DB_LOCAL_PATH, "utf-8"));
  console.log(`📄 Banco carregado: ${db.chapas.length} chapas`);

  app.listen(PORT, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${PORT}`);
  });
}

init().catch((err) => {
  console.error("❌ Erro ao inicializar:", err);
});
