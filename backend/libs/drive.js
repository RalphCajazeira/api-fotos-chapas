// 📦 Lib de integração com Google Drive
// Responsável por autenticação e funções utilitárias de sincronização

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// 🧠 Detecta ambiente de produção
const isProduction = process.env.NODE_ENV === "production";

// 🔐 Autenticação dinâmica por ambiente
const auth = new google.auth.GoogleAuth({
  ...(isProduction
    ? {
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
      }
    : {
        keyFile: path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH),
      }),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// 📁 Instância do Google Drive autenticada
const drive = google.drive({ version: "v3", auth });

// 🔍 Busca o arquivo 'db.json' dentro da pasta informada
async function findDatabaseFile(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name = 'db.json' and trashed = false`,
    fields: "files(id, name)",
  });
  return res.data.files[0];
}

// 📥 Baixa o arquivo do Drive e salva no caminho local indicado
async function downloadDatabase(fileId, localPath) {
  const dest = fs.createWriteStream(localPath);
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  return new Promise((resolve, reject) => {
    res.data
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .pipe(dest);
  });
}

// 🆕 Cria um novo arquivo 'db.json' vazio no Drive e salva localmente
async function createDatabaseFile(folderId, localPath) {
  const fileMetadata = {
    name: "db.json",
    parents: [folderId],
  };

  fs.writeFileSync(localPath, JSON.stringify({}, null, 2)); // inicializa com objeto vazio

  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(localPath),
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
  });

  return file.data.id;
}

// 📤 Faz upload de qualquer arquivo para o Drive, retorna nome e ID
async function uploadFileToDrive(file, folderId) {
  const metadata = {
    name: file.originalname,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const res = await drive.files.create({
    requestBody: metadata,
    media,
    fields: "id, name",
  });

  return res.data;
}

// 🔁 Exporta funções e drive instance
module.exports = {
  drive,
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
  uploadFileToDrive,
};
