const db = require("../../database/connection");
const { drive } = require("../../libs/drive");
const isProduction = process.env.NODE_ENV === "production";

// 🧠 Salva arquivo no Drive e banco de dados
async function uploadFile(file, folder_id, internal_code, width, height) {
  try {
    const metadata = {
      name: file.originalname,
      parents: [folder_id],
    };

    const media = {
      mimeType: file.mimetype,
      body: require("fs").createReadStream(file.path),
    };

    const driveRes = await drive.files.create({
      requestBody: metadata,
      media,
      fields: "id, name",
    });

    const [saved] = await db("files")
      .insert({
        name: file.originalname,
        drive_id: driveRes.data.id,
        folder_id,
        internal_code,
        width,
        height,
      })
      .returning("*");

    return saved;
  } catch (error) {
    if (!isProduction) console.error("❌ Error uploading file:", error.message);
    throw error;
  }
}

async function getAll() {
  return db("files").select("*");
}

async function getByFolder(folderId) {
  return db("files").where({ folder_id: folderId });
}

async function deleteFile(id) {
  try {
    const file = await db("files").where({ id }).first();
    if (!file) throw new Error(`File ${id} not found`);

    await drive.files.delete({ fileId: file.drive_id });
    await db("files").where({ id }).del();

    return true;
  } catch (error) {
    if (!isProduction) console.error("❌ Error deleting file:", error.message);
    throw error;
  }
}

module.exports = {
  uploadFile,
  getAll,
  getByFolder,
  deleteFile,
};
