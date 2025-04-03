const { google } = require("googleapis");
const fs = require("fs");

// 🔐 Autenticação com a conta de serviço (Railway usa JSON direto da env)
const auth = new google.auth.GoogleAuth({
  ...(process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? { credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON) }
    : { keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_PATH }),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

/**
 * 🔍 Verifica se existe o arquivo db.json no Drive
 */
async function findDatabaseFile(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name = 'db.json' and trashed = false`,
    fields: "files(id, name)",
  });

  return res.data.files[0]; // undefined se não existir
}

/**
 * 📥 Baixa o db.json do Drive para o caminho local
 */
async function downloadDatabase(fileId, localPath) {
  const dest = fs.createWriteStream(localPath);

  await drive.files
    .get({ fileId, alt: "media" }, { responseType: "stream" })
    .then((res) => {
      return new Promise((resolve, reject) => {
        res.data
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .pipe(dest);
      });
    });
}

/**
 * 🆕 Cria um novo db.json no Drive se não existir
 */
async function createDatabaseFile(folderId, localPath) {
  fs.writeFileSync(localPath, JSON.stringify({}, null, 2));

  const fileMetadata = {
    name: "db.json",
    parents: [folderId],
  };

  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(localPath),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });

  return res.data.id;
}

/**
 * 📤 Envia qualquer arquivo (ex: imagem) para o Google Drive
 */
async function uploadFileToDrive(file, folderId) {
  const fileMetadata = {
    name: file.originalname,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, name",
  });

  return res.data;
}

module.exports = {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
  uploadFileToDrive, // ✅ agora está exportado corretamente
};
