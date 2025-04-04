const fs = require("fs");
const path = require("path");
const { drive, uploadDatabaseFile } = require("../../libs/drive");

const DB_PATH = path.join(__dirname, "../../data/db.json");
const ROOT_FOLDER = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

function loadDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  const db = raw.trim() ? JSON.parse(raw) : {};

  db.lastId = db.lastId || 0;
  db.nodes = Array.isArray(db.nodes) ? db.nodes : [];

  return db;
}

function saveDB(data) {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(DB_PATH, content);

  // 🔁 Atualiza no Drive também
  uploadDatabaseFile(content).catch((err) =>
    console.error("❌ Failed to sync db.json to Drive:", err.message)
  );
}

function generateId(db) {
  db.lastId = (db.lastId || 0) + 1;
  return db.lastId;
}

async function createFolder(name, parentId = null) {
  try {
    console.log("🚀 Creating folder on Google Drive:", name);

    const db = loadDB();

    // 🚫 Impede duplicadas no mesmo diretório
    const folderExists = db.nodes.some(
      (n) =>
        n.type === "folder" &&
        n.name.toLowerCase() === name.toLowerCase() &&
        (n.parentId || null) === (parentId || null)
    );

    if (folderExists) {
      throw new Error(`❌ Folder "${name}" already exists in this directory`);
    }

    // 📁 Criação no Google Drive
    const metadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId || ROOT_FOLDER],
    };

    const driveRes = await drive.files.create({
      requestBody: metadata,
      fields: "id, name",
    });

    const { id: driveId, name: driveName } = driveRes.data;

    if (!driveId) throw new Error("❌ Failed to create folder on Drive");

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

    console.log("✅ Folder created and saved:", newFolder);
    return newFolder;
  } catch (error) {
    console.error("❌ Error in createFolder:", error.message);
    throw error;
  }
}

module.exports = {
  createFolder,
};
