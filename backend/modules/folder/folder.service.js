const fs = require("fs");
const path = require("path");
const { drive } = require("../../libs/drive");

const DB_PATH = path.join(__dirname, "../../data/db.json");
const ROOT_FOLDER = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

function loadDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return raw.trim() ? JSON.parse(raw) : { lastId: 0, nodes: [] };
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId(db) {
  db.lastId = (db.lastId || 0) + 1;
  return db.lastId;
}

async function createFolder(name, parentId) {
  console.log("🚀 Creating folder on Google Drive:", name);

  const metadata = {
    name,
    mimeType: "application/vnd.google-apps.folder",
    ...(parentId || ROOT_FOLDER ? { parents: [parentId || ROOT_FOLDER] } : {}),
  };

  const driveRes = await drive.files.create({
    requestBody: metadata,
    fields: "id, name",
  });

  // ✅ Correto: acessa direto de res.data
  const { id: driveId, name: driveName } = driveRes.data;

  const db = loadDB();
  const newFolder = {
    id: generateId(db),
    type: "folder",
    name: driveName,
    driveId,
    parentId: parentId || null,
    children: [],
  };

  db.nodes.push(newFolder);
  saveDB(db);

  console.log("✅ Folder created successfully:", newFolder);
  return newFolder;
}

module.exports = {
  createFolder,
};
