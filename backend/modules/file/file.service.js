const db = require("../../database/connection");
const { drive } = require("../../libs/drive");
const fs = require("fs");
const isProduction = process.env.NODE_ENV === "production";

// 🧠 Salva arquivo no Drive e banco de dados
async function uploadFile(file, folder_id, name, width, height, code) {
  try {
    // 📁 Verifica se a pasta existe
    const folder = await db("folders").where({ id: folder_id }).first();
    if (!folder) throw new Error(`Folder not found: ${folder_id}`);

    // ☁️ Upload para o Drive
    const metadata = {
      name: file.originalname,
      parents: [folder.drive_id],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const driveRes = await drive.files.create({
      requestBody: metadata,
      media,
      fields: "id, name",
    });

    const driveId = driveRes?.data?.id;
    if (!driveId) throw new Error("Drive upload failed.");

    // 🧠 Inserção no banco
    const [saved] = await db("files")
      .insert({
        name,
        drive_id: driveId,
        folder_id,
        internal_code: code,
        width,
        height,
      })
      .returning("*");

    const newDriveName = `${name} ${width} x ${height} Código ${code} Id ${saved.id}`;

    try {
      // ✏️ Renomeia no Drive
      await drive.files.update({
        fileId: driveId,
        requestBody: { name: newDriveName },
      });
    } catch (renameErr) {
      // ⛔ Rollback do banco
      await db("files").where({ id: saved.id }).del();

      if (!isProduction)
        console.error(
          "❌ Failed to rename. Rolling back DB:",
          renameErr.message
        );
      throw new Error("Drive rename failed. Operation cancelled.");
    }

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
