const db = require("../database/connection");
const { drive } = require("../libs/drive");
const isProduction = process.env.NODE_ENV === "production";

// 🔍 Listar todas as pastas
async function getAll() {
  try {
    return await db("folders").select("*");
  } catch (error) {
    if (!isProduction)
      console.error("❌ Error fetching folders:", error.message);
    throw error;
  }
}

// 📁 Criar pasta no Drive e salvar no banco
async function createFolder(name, parent_id = null) {
  try {
    const exists = await db("folders").where({ name, parent_id }).first();
    if (exists)
      throw new Error(`Folder "${name}" already exists in this directory`);

    // 🔍 Resolve drive_id do pai
    let parentDriveId = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;
    if (parent_id !== null) {
      const parent = await db("folders").where({ id: parent_id }).first();
      if (!parent) throw new Error("Parent folder not found");
      parentDriveId = parent.drive_id;
    }

    // 📁 Criação no Google Drive
    const metadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentDriveId],
    };

    const driveRes = await drive.files.create({
      requestBody: metadata,
      fields: "id, name",
    });

    // 💾 Salva no banco
    const [folder] = await db("folders")
      .insert({
        name,
        parent_id,
        drive_id: driveRes.data.id,
      })
      .returning("*");

    return folder;
  } catch (error) {
    if (!isProduction)
      console.error("❌ Error creating folder:", error.message);
    throw error;
  }
}

// ✏️ Renomear pasta no Drive e no banco
async function renameFolder(id, newName) {
  try {
    const folder = await db("folders").where({ id }).first();
    if (!folder) throw new Error(`Folder with ID ${id} not found`);

    if (folder.name === newName) {
      throw new Error("New name is the same as the current name");
    }

    const nameConflict = await db("folders")
      .where({ name: newName, parent_id: folder.parent_id })
      .andWhereNot({ id })
      .first();

    if (nameConflict) {
      throw new Error(`Folder "${newName}" already exists in this directory`);
    }

    await drive.files.update({
      fileId: folder.drive_id,
      requestBody: { name: newName },
    });

    const [updated] = await db("folders")
      .where({ id })
      .update({ name: newName })
      .returning("*");

    return updated;
  } catch (error) {
    if (!isProduction)
      console.error("❌ Error renaming folder:", error.message);
    throw error;
  }
}

// 🗑️ Deletar pasta do Drive e do banco
async function deleteFolder(id) {
  try {
    const folder = await db("folders").where({ id }).first();
    if (!folder) throw new Error(`Folder with ID ${id} not found`);

    await drive.files.delete({ fileId: folder.drive_id });

    const deleted = await db("folders").where({ id }).del();
    if (!deleted) throw new Error(`Failed to delete folder with ID ${id}`);

    return true;
  } catch (error) {
    if (!isProduction)
      console.error("❌ Error deleting folder:", error.message);
    throw error;
  }
}

async function getFolderById(id) {
  try {
    return await db("folders").where({ id }).first();
  } catch (error) {
    if (!isProduction)
      console.error("❌ Error fetching folder by ID:", error.message);
    throw error;
  }
}

async function getFoldersByParent(parentId) {
  try {
    const query = db("folders").select("*");

    if (parentId === undefined) {
      return query.whereNull("parent_id");
    }

    return query.where("parent_id", parentId);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ Error fetching folders by parent:", error.message);
    }
    throw error;
  }
}

module.exports = {
  getAll,
  createFolder,
  renameFolder,
  deleteFolder,
  getFolderById,
  getFoldersByParent,
};
