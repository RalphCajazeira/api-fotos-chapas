const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

async function findDatabaseFile(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and name = 'db.json' and trashed = false`,
    fields: "files(id, name)",
  });

  return res.data.files[0]; // retorna undefined se não tiver
}

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

async function createDatabaseFile(folderId, localPath) {
  fs.writeFileSync(localPath, JSON.stringify({ chapas: [] }, null, 2));

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

module.exports = {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
};
