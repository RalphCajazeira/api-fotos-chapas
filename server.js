require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/" }); // salva temporariamente

const {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
} = require("./utils/drive");

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;
const DB_LOCAL_PATH = path.join(__dirname, "data", "db.json");
const PORT = process.env.PORT || 3000;

const app = express();

// ✅ CORS seguro para GitHub Pages
const allowedOrigins = [
  "https://ralphcajazeira.github.io",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// ✅ Rota pública para consultar o banco de dados
app.get("/db", (req, res) => {
  try {
    const data = fs.readFileSync(DB_LOCAL_PATH, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("❌ Erro ao ler db.json:", err);
    res.status(500).json({ error: "Erro ao ler banco de dados." });
  }
});

// Rota de upload de imagem
app.post("/upload", upload.single("foto"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Arquivo não encontrado" });
    }

    // Simula resposta (depois podemos integrar com Google Drive)
    res.json({
      success: true,
      fileName: file.originalname,
      info: "Upload recebido com sucesso!",
    });
  } catch (err) {
    console.error("Erro no upload:", err);
    res
      .status(500)
      .json({ success: false, message: "Erro interno no upload." });
  }
});

async function init() {
  console.log("🚀 Iniciando verificação do banco no Google Drive...");

  // Cria a pasta local se necessário
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

  // Carrega o banco em memória
  const db = JSON.parse(fs.readFileSync(DB_LOCAL_PATH, "utf-8"));
  console.log(`📄 Banco carregado: ${db.chapas.length} chapas`);

  // ✅ Inicia servidor Express
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

init().catch((err) => {
  console.error("❌ Erro ao inicializar:", err);
});
